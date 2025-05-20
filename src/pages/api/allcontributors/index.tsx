import { Request, Response } from 'express';
import { Octokit } from "@octokit/rest";

const mongoose = require('mongoose');

const fetch = require("node-fetch"); // If you're using this in a Node.js environment
// Replace this with your personal access token
const githubToken = process.env.ACCESS_TOKEN;
const repoOwner2 = "ethereum";
const repoName2 = "EIPs";

// Function to fetch contributors recursively and handle pagination
async function fetchContributors(url: any, headers:any, allContributors = []) {
    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`Failed to fetch contributors. Status code: ${response.status}`);
    }
    const contributors = await response.json();
    allContributors = allContributors?.concat(contributors);

    // Check if there are more pages of contributors
    const nextPageLink = response.headers.get("link");
    if (nextPageLink && nextPageLink.includes('rel="next"')) {
        const nextPageUrl = nextPageLink.match(/<([^>]+)>;\s*rel="next"/)[1];
        return fetchContributors(nextPageUrl, headers, allContributors);
    } else {
        return allContributors;
    }
}

// Construct the URL for the GitHub API endpoint
const url2 = `https://api.github.com/repos/${repoOwner2}/${repoName2}/contributors`;

// Set up headers for authentication
const headers2 = {
    Accept: "application/vnd.github.v3+json",
    Authorization: `token ${githubToken}`,
};



export default async (req: Request, res: Response) => {
    const allcontributors=await fetchContributors(url2,headers2);
    if(allcontributors){
        res.json(allcontributors);
    }
    else{
        res.send('internal server error');
    }
};


