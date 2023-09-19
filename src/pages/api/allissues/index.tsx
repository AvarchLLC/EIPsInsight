const express = require("express");
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const { Octokit } = require('@octokit/rest');
const mongoose = require('mongoose');
const accessToken = process.env.ACCESS_TOKEN;
import { Request, Response } from 'express';

let page = 1;
let allOpenIssues: number[] = []; // Explicitly declare the type as an array of numbers


const perPage = 100; // Number of items per page

async function fetchIssues() {
    try {
        let hasNextPage = true;

        while (hasNextPage) {
            const response = await axios.get(`https://api.github.com/repos/ethereum/EIPs/issues?state=open&page=${page}&per_page=${perPage}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const linkHeader = response.headers.link;
            hasNextPage = linkHeader && linkHeader.includes('rel="next"');
            const issueNumbers = response.data.map((issue:any) => issue.number);
            allOpenIssues = allOpenIssues.concat(issueNumbers);

            if (hasNextPage) {
                page++;
            }
        }

        return allOpenIssues;
    } catch (error) {
        throw error; // Propagate the error
    }
}


export default async (req: Request, res: Response) => {
    try {
        const result = await fetchIssues();
        console.log(result.length);
        res.json(result);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
};
