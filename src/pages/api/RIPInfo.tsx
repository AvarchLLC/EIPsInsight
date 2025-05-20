import { Request, Response } from "express";
import { Octokit } from "@octokit/rest";
import axios from "axios";

export default async (req: Request, res: Response) => {
  try {
    const repositoryUrl = "https://api.github.com/repos/ethereum/RIPs";
    const response = await axios.get(repositoryUrl);

    console.log(response);

    const forksCount = response.data.forks_count;
    const watchlistCount = response.data.subscribers_count;
    const stars = response.data.stargazers_count;

    // Fetch open pull requests count
    // const pullRequestsUrl = `${repositoryUrl}/pulls?state=open`;
    // const pullRequestsResponse = await axios.get(pullRequestsUrl);
    // const openPullRequestsCount = pullRequestsResponse.data?.length;

    // Fetch open issues count
    // const issuesUrl = `${repositoryUrl}/issues?state=open`;
    // const issuesResponse = await axios.get(issuesUrl);
    const openIssuesCount = response.data.open_issues_count;
    res.json({
      forksCount,
      watchlistCount,
      stars,
      openIssuesCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
