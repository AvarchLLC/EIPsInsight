/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

use std::collections::HashSet;

use askama::Template;
use chrono::{DateTime, Utc};
use eipw_preamble::Preamble;
use octocrab::models::pulls::ReviewState;
use octocrab::params;
use octocrab::{models::pulls::PullRequest, Octocrab};
use regex::Regex;

#[derive(Template)]
#[template(path = "index.html")]
struct HtmlTemplate {
    urls: Vec<String>,
}

#[derive(Template)]
#[template(path = "index.md")]
struct MarkdownTemplate {
    urls: Vec<String>,
}

#[derive(Debug)]
struct Event {
    actor: Actor,
    when: DateTime<Utc>,
}

#[derive(Debug, PartialEq, Eq)]
enum Actor {
    Author,
    Editor,
}

#[tokio::main]
async fn main() -> octocrab::Result<()> {
    let token = std::env::var("GITHUB_TOKEN").expect("GITHUB_TOKEN env variable is required");
    let repo =
        std::env::var("GITHUB_REPOSITORY").expect("GITHUB_REPOSITORY env variable is requried");

    let (owner, repo) = repo
        .split_once('/')
        .expect("No slash in GitHub repository.");

    let octocrab = Octocrab::builder().personal_token(token).build()?;
    let editors = editors(&octocrab, owner, repo).await?;
    let opr = open_pull_requests(&octocrab, owner, repo).await?;

    let mut needs_review = Vec::new();

    for pr in opr {
        let created = match pr.created_at {
            Some(created) => created,
            None => {
               
                continue; 
            }
        };
    
        let mut events = vec![Event {
            actor: Actor::Author,
            when: created,
        }];
    
        match reviewed_by_editor(&octocrab, &editors, &pr, owner, repo).await {
            Ok(Some(review_event)) => {
                events.push(review_event);
            }
            Err(_) => {
                continue; 
            }
            _ => {}
        }
        let pr_authors = match authors(&octocrab, &pr, owner, repo).await {
            Ok(authors) => authors,
            Err(_) => {
                continue; 
            }
        };
        let comments = match comments(&octocrab, &pr, owner, repo, &editors, &pr_authors).await {
            Ok(comments) => comments,
            Err(_) => {
                continue;
            }
        };
        events.extend(comments);
        let pr_comments = match pr_comments(&octocrab, &pr, owner, repo, &editors, &pr_authors).await {
            Ok(comments) => comments,
            Err(_) => {
                continue; 
            }
        };
        events.extend(pr_comments);
        let pr_commits = match commits(&octocrab, &pr, owner, repo).await {
            Ok(commits) => commits,
            Err(_) => {
                continue;
            }
        };
        events.extend(pr_commits);
        events.retain(|f| f.when >= created);
        events.sort_unstable_by_key(|x| x.when);
        let last_editor = events.iter().filter(|x| x.actor == Actor::Editor).last();
        let last_editor = match last_editor {
            None => {
                if let Some(first_event) = events.get(0) {
                    needs_review.push((first_event.when, pr.html_url));
                }
                continue; 
            }
            Some(e) => e,
        };
        let first_author = events
            .iter()
            .find(|x| x.actor == Actor::Author && x.when > last_editor.when);
        if let Some(first_author) = first_author {
            needs_review.push((first_author.when, pr.html_url));
        }
    }
    needs_review.sort();
    let urls = needs_review
        .into_iter()
        .filter_map(|x| x.1)
        .map(|x| x.to_string())
        .collect();
    let markdown = matches!(std::env::args().nth(1).as_deref(), Some("--markdown"));
    if markdown {
        let index = MarkdownTemplate { urls };
        println!("{}", index.render().unwrap());
    } else {
        let index = HtmlTemplate { urls };
        println!("{}", index.render().unwrap());
    }
    Ok(())
}

async fn reviewed_by_editor(
    oct: &Octocrab,
    editors: &HashSet<String>,
    open_pr: &PullRequest,
    owner: &str,
    repo: &str,
) -> octocrab::Result<Option<Event>> {
    let mut current_page = oct
        .pulls(owner, repo)
        .list_reviews(open_pr.number)
        .per_page(255)
        .send()
        .await?;

    let mut reviews = current_page.take_items();

    while let Some(mut new_page) = oct.get_page(&current_page.next).await? {
        reviews.extend(new_page.take_items());

        current_page = new_page;
    }

    if reviews.is_empty() {
        return Ok(None);
    }

    let mut reviewers: Vec<_> = reviews
        .into_iter()
        .filter(|x| {
            matches!(
                x.state,
                Some(ReviewState::ChangesRequested | ReviewState::Commented)
            )
        })
        .filter(|x| {
            let user = match &x.user {
                Some(u) => u,
                None => return false,
            };
            editors.contains(&user.login.to_lowercase())
        })
        .collect();

    reviewers.sort_by_key(|x| x.submitted_at);

    match reviewers.last() {
        Some(u) => Ok(Some(Event {
            actor: Actor::Editor,
            when: u.submitted_at.unwrap(),
        })),
        None => Ok(None),
    }
}

async fn open_pull_requests(
    oct: &Octocrab,
    owner: &str,
    repo: &str,
) -> octocrab::Result<Vec<PullRequest>> {
    let mut current_page = oct
        .pulls(owner, repo)
        .list()
        .state(params::State::Open)
        .per_page(100)
        .send()
        .await?;

    let mut prs = current_page.take_items();

    while let Some(mut new_page) = oct.get_page(&current_page.next).await? {
        prs.extend(new_page.take_items());

        current_page = new_page;
    }
    let prs = prs.into_iter().filter(|x| x.draft != Some(true)).collect();

    Ok(prs)
}

async fn editors(oct: &Octocrab, owner: &str, repo: &str) -> octocrab::Result<HashSet<String>> {
    let mut content = oct
        .repos(owner, repo)
        .get_content()
        .path("config/eip-editors.yml")
        .r#ref("master")
        .send()
        .await?;

    let contents = content.take_items();  
    let c = &contents[0];
    let decoded_content = c.decoded_content().unwrap(); 
    let re = Regex::new(r"(?m)^  - (.+)").unwrap();

    let mut results = HashSet::new();
    for (_, [username]) in re.captures_iter(&decoded_content).map(|c| c.extract()) {
        results.insert(username.to_lowercase());
    }
    Ok(results)
}

async fn authors(
    oct: &Octocrab,
    pr: &PullRequest,
    owner: &str,
    repo: &str,
) -> octocrab::Result<HashSet<String>> {
    let mut current_page = oct.pulls(owner, repo).list_files(pr.number).await?;
    let mut files = current_page.take_items();

    while let Some(mut new_page) = oct.get_page(&current_page.next).await? {
        files.extend(new_page.take_items());

        current_page = new_page;
    }

    let re = Regex::new(r"(EIPS|ERCS)/(eip|erc)-[0-9]+\.md").unwrap();
    let files = files.into_iter().filter_map(|x| {
        if re.is_match(&x.filename) {
            Some(x.filename)
        } else {
            None
        }
    });

    let mut author_set = HashSet::new();
    let repo = pr.head.repo.as_ref().unwrap();

    let re = Regex::new(r"^[^()<>,@]+ \(@([a-zA-Z\d-]+)\)(?: <[^@][^>]*@[^>]+\.[^>]+>)?$").unwrap();

    for file in files {
        let owner_login = &repo.owner.as_ref().unwrap().login;
        let mut content = oct
            .repos(owner_login, &repo.name)
            .get_content()
            .path(&file)
            .r#ref(&pr.head.ref_field)
            .send()
            .await?;
        let contents = content.take_items();
        let c = &contents[0];
        let decoded_content = c.decoded_content().unwrap();

        let (preamble, _) = match Preamble::split(&decoded_content) {
            Err(e) => {
                eprintln!("{:?}: {e}", pr.html_url);
                continue;
            }
            Ok(o) => o,
        };
        let preamble = match Preamble::parse(Some(&file), preamble) {
            Err(e) => {
                eprintln!("{:?}: {e}", pr.html_url);
                continue;
            }
            Ok(o) => o,
        };
        let authors = preamble.by_name("author").unwrap().value().trim();

        let authors = authors.split(',').map(str::trim);

        for author in authors {
            let captures = match re.captures(author) {
                Some(s) => s,
                None => continue,
            };
            let username = captures.get(1).unwrap().as_str().to_lowercase();
            author_set.insert(username);
        }
    }
    Ok(author_set)
}

async fn comments(
    oct: &Octocrab,
    pr: &PullRequest,
    owner: &str,
    repo: &str,
    editors: &HashSet<String>,
    authors: &HashSet<String>,
) -> octocrab::Result<Vec<Event>> {
    let mut current_page = oct
        .issues(owner, repo)
        .list_comments(pr.number)
        .per_page(100)
        .send()
        .await?;

    let mut comments = current_page.take_items();

    while let Some(mut new_page) = oct.get_page(&current_page.next).await? {
        comments.extend(new_page.take_items());

        current_page = new_page;
    }

    let events = comments
        .into_iter()
        .map(|x| (x.user.login.to_lowercase(), x.created_at))
        .filter_map(|(author, created_at)| {
            if editors.contains(&author) {
                Some(Event {
                    actor: Actor::Editor,
                    when: created_at,
                })
            } else if authors.contains(&author) {
                Some(Event {
                    actor: Actor::Author,
                    when: created_at,
                })
            } else {
                None
            }
        })
        .collect();
    Ok(events)
}

async fn pr_comments(
    oct: &Octocrab,
    pr: &PullRequest,
    owner: &str,
    repo: &str,
    editors: &HashSet<String>,
    authors: &HashSet<String>,
) -> octocrab::Result<Vec<Event>> {
    let mut current_page = oct
        .pulls(owner, repo)
        .list_comments(Some(pr.number))
        .per_page(100)
        .send()
        .await?;

    let mut comments = current_page.take_items();

    while let Some(mut new_page) = oct.get_page(&current_page.next).await? {
        comments.extend(new_page.take_items());

        current_page = new_page;
    }

    let events = comments
        .into_iter()
        .filter_map(|x| match x.user {
            Some(s) => Some((s, x.created_at)),
            None => None,
        })
        .map(|(user, created_at)| (user.login.to_lowercase(), created_at))
        .filter_map(|(author, created_at)| {
            if editors.contains(&author) {
                Some(Event {
                    actor: Actor::Editor,
                    when: created_at,
                })
            } else if authors.contains(&author) {
                Some(Event {
                    actor: Actor::Author,
                    when: created_at,
                })
            } else {
                None
            }
        })
        .collect();
    Ok(events)
}

async fn commits(
    oct: &Octocrab,
    pr: &PullRequest,
    owner: &str,
    repo: &str,
) -> octocrab::Result<Vec<Event>> {
    let mut current_page = oct
        .pulls(owner, repo)
        .pr_commits(pr.number)
        .per_page(250)
        .send()
        .await?;

    assert!(current_page.next.is_none());
    let commits = current_page.take_items();
    assert!(
        commits.len() < 250,
        "/pulls/{{number}}/commits can only read 250 commits"
    );

    let events = commits
        .into_iter()
        // Pick a date for each commit, based on committer (or failing that, author.)
        .filter_map(|x| {
            x.commit
                .committer
                .and_then(|x| x.date)
                .or_else(|| x.commit.author.and_then(|x| x.date))
        })
        .map(|when| Event {
            actor: Actor::Author,
            when,
        })
        .collect();
    Ok(events)
}
