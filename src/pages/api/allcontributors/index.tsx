import type { NextApiRequest, NextApiResponse } from 'next'
import { Octokit } from "@octokit/rest";

const mongoose = require('mongoose');

const fetch = require("node-fetch"); // If you're using this in a Node.js environment
// Replace this with your personal access token
const githubToken = process.env.ACCESS_TOKEN;
const repoOwner2 = "ethereum";
const repoName2 = "EIPs";

// Simple in-memory cache to avoid hammering GitHub from development / repeated requests
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes
let contributorsCache: { data: any[] | null; ts: number } = { data: null, ts: 0 };
let last403Log = 0;
const LOG_THROTTLE_MS = 1000 * 60 * 10; // throttle repeated 403 logs to every 10 minutes

// Function to fetch contributors recursively and handle pagination
async function fetchContributors(url: any, headers: any, allContributors = []) {
    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            // Return the response object for better error handling by the caller
            return { ok: false, status: response.status, statusText: response.statusText } as any;
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
    } catch (err: any) {
        // Network or other unexpected error
        return { ok: false, status: err?.status || 500, statusText: err?.message || String(err) } as any;
    }
}

// Construct the URL for the GitHub API endpoint
const url2 = `https://api.github.com/repos/${repoOwner2}/${repoName2}/contributors`;

// Set up headers for authentication
const headers2 = {
    Accept: "application/vnd.github.v3+json",
    Authorization: `token ${githubToken}`,
};



export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Return cached data when fresh
        const now = Date.now();
        if (contributorsCache.data && (now - contributorsCache.ts) < CACHE_TTL) {
            return res.status(200).json(contributorsCache.data);
        }

        const allcontributors = await fetchContributors(url2, headers2);

        // If fetchContributors returned an error-like object (e.g., 403 rate limit / forbidden)
        if (allcontributors && (allcontributors as any).ok === false) {
            const status = (allcontributors as any).status;

            // Throttle noisy 403 logs
            if (status === 403) {
                const shouldLog = (now - last403Log) > LOG_THROTTLE_MS;
                if (shouldLog) {
                    console.warn(`GitHub contributors fetch returned 403 (forbidden). This is likely rate-limiting or an invalid token. Next log in ${LOG_THROTTLE_MS/60000}min if it persists.`);
                    last403Log = now;
                }

                // If we have cached data, return it silently
                if (contributorsCache.data) {
                    return res.status(200).json(contributorsCache.data);
                }

                // Return a safe empty response (200) with a short message so front-end can degrade gracefully
                return res.status(200).json({ contributors: [], message: 'GitHub API returned 403 (forbidden). Data temporarily unavailable.' });
            }

            // For other non-ok responses, log minimally and return empty dataset
            console.warn('GitHub contributors fetch failed:', { status: (allcontributors as any).status, statusText: (allcontributors as any).statusText });
            return res.status(200).json({ contributors: [], message: 'GitHub contributors unavailable.' });
        }

        // Success: cache result and return
        contributorsCache = { data: allcontributors || [], ts: now };
        return res.status(200).json(allcontributors || []);
    } catch (err: any) {
        console.error('Error in /api/allcontributors (unexpected):', err?.message || err);
        return res.status(500).json({ error: 'Internal server error fetching contributors', details: err?.message || String(err) });
    }
};


