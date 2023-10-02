import { Request, Response } from 'express';
import { Octokit } from "@octokit/rest";
import axios from 'axios';
import * as cheerio from 'cheerio';


export default async (req: Request, res: Response) => {
    try {
        const url = 'https://github.com/ethereum/EIPs/pulse_diffstat_summary?period=month';
        const response = await axios.get(url);
        const html = response.data;

        // Load the HTML using Cheerio
        const $ = cheerio.load(html);

        // Extract the desired information
        const infoContainer = $('div.color-fg-muted');
        const numAuthors = infoContainer.find('strong.color-fg-default').eq(0).text().trim();
        const commitsToMaster = infoContainer.find('strong.color-fg-default span.text-emphasized').eq(0).text().trim();
        const commitsToAllBranches = infoContainer.find('strong.color-fg-default span.text-emphasized').eq(1).text().trim();
        const filesChanged = infoContainer.find('strong.color-fg-default').eq(1).text().trim();
        const additions = infoContainer.find('strong.color-fg-success').text().trim();
        const deletions = infoContainer.find('strong.color-fg-danger').text().trim();

        const info = {
            numAuthors: parseInt(numAuthors),
            commitsToMaster: parseInt(commitsToMaster),
            commitsToAllBranches: parseInt(commitsToAllBranches),
            filesChanged: parseInt(filesChanged),
            additions: parseInt(additions),
            deletions: parseInt(deletions)
        };

        res.json(info);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
