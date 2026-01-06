import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

let viewsCount = 9000;

const viewsFilePath = path.join(__dirname, 'data', 'views.json');

setInterval(() => {
    fs.mkdirSync(path.dirname(viewsFilePath), { recursive: true });
    fs.writeFileSync(viewsFilePath, JSON.stringify({ viewsCount }));
}, 15000);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET': {
            res.status(200).json({ viewsCount });
            return;
        }
        case 'POST': {
            viewsCount++;
            res.status(200).json({ viewsCount });
            return;
        }
        default: {
            res
                .status(405)
                .json({ error: `Method ${req.method ?? 'UNKNOWN'} Not Allowed` });
        }
    }
}
