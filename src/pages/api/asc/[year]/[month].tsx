import { Request, Response } from 'express';
import { Octokit } from "@octokit/rest";

async function getGitHubInsightsForMonth(owner: string, repo: string, year: number, month: number) {
  const octokit = new Octokit({ auth: process.env.ACCESS_TOKEN });

  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const startISODate = startDate.toISOString();
    const endISODate = endDate.toISOString();

    let page = 1;
    let mergedPRsThisMonth: any[] = [];

    while (true) {
      const { data: mergedPRs } = await octokit.pulls.list({
        owner,
        repo,
        state: 'closed',
        sort: 'created',
        direction: 'desc',
        per_page: 100,
        page,
      });

      const prsInDateRange = mergedPRs?.filter(
        (pr: any) =>
          pr.merged_at &&
          new Date(pr.merged_at) >= startDate &&
          new Date(pr.merged_at) <= endDate
      );

      mergedPRsThisMonth = mergedPRsThisMonth?.concat(prsInDateRange);

      if (prsInDateRange?.length < 100) {
        break;
      }

      page++;
    }
       // Print the titles of merged PRs
       for (const pr of mergedPRsThisMonth) {
           console.log(pr.title);
       }

       // Get the open pull requests
       const { data: openPRs } = await octokit.pulls.list({
           owner,
           repo,
           state: 'open',
           per_page: 100,
           page: 1,
       });

       const openPRsThisMonth = openPRs?.filter(
           (pr) => new Date(pr.created_at) >= startDate && new Date(pr.created_at) <= endDate
       );

       // Print the titles of open PRs
       for (const pr of openPRsThisMonth) {
           console.log(pr.title);
       }

       // Get the closed issues
       const { data: closedIssues } = await octokit.issues.listForRepo({
           owner,
           repo,
           state: 'closed',
           sort: 'created',
           direction: 'desc',
           per_page: 100,
           page: 1,
       });

       const closedIssuesThisMonth = closedIssues?.filter(
        (issue) =>
          issue.closed_at &&
          new Date(issue.closed_at) >= startDate &&
          new Date(issue.closed_at) <= endDate
      );

       // Get the new issues
       const { data: newIssues } = await octokit.issues.listForRepo({
           owner,
           repo,
           state: 'open',
           sort: 'created',
           direction: 'asc',
           per_page: 100,
           page: 1,
       });

       const newIssuesThisMonth = newIssues?.filter(
           (issue) => new Date(issue.created_at) >= startDate && new Date(issue.created_at) <= endDate
       );

       // Get the commits to master branch
       const { data: commitsToMaster } = await octokit.repos.listCommits({
           owner,
           repo,
           sha: 'master',
           since: startISODate,
           until: endISODate,
           per_page: 100,
           page: 1,
       });

       // Get the commits to all branches
       const { data: commitsToAllBranches } = await octokit.repos.listCommits({
           owner,
           repo,
           since: startISODate,
           until: endISODate,
           per_page: 100,
           page: 1,
       });

       // Get the contributors
       const { data: contributors } = await octokit.repos.listContributors({
           owner,
           repo,
           per_page: 100,
           page: 1,
       });

       // Get the number of files changed, insertions, and deletions
       let filesChanged = 0;
       let insertions = 0;
       let deletions = 0;

       for (const commit of commitsToAllBranches) {
        const { data: commitDetails } = await octokit.repos.getCommit({
          owner,
          repo,
          ref: commit.sha,
        });
      
        if (
          commitDetails.files &&
          commitDetails.stats &&
          commitDetails.stats.additions &&
          commitDetails.stats.deletions
        ) {
          filesChanged += commitDetails.files?.length;
          insertions += commitDetails.stats.additions;
          deletions += commitDetails.stats.deletions;
        }
      }
      

       // Return the insights as an object
       const insights = {
           mergedPRs: mergedPRsThisMonth?.length,
           openPRs: openPRsThisMonth?.length,
           closedIssues: closedIssuesThisMonth?.length,
           newIssues: newIssuesThisMonth?.length,
           commitsToMaster: commitsToMaster?.length,
           commitsToAllBranches: commitsToAllBranches?.length,
           contributors: contributors?.length,
           filesChanged,
           insertions,
           deletions,
       };

       return insights;
      } catch (error) {
        throw error as Error;
      }
}

export default async (req: Request, res: Response) => {
  const parts = req.url.split("/");
  const year = parseInt(parts[3]);
  const month = parseInt(parts[4]);
  try {
    const owner = 'ethereum';
    const repo = 'EIPs';

    const result = await getGitHubInsightsForMonth(owner, repo, year, month);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
