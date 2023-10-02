import express from 'express';
import fs from 'fs';
const path = require('path');

const app = express();
let viewsCount = 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/count/viewCounter', (req, res) => {
    res.json({ viewsCount });
});

app.post('/api/count/viewCounter', (req, res) => {
    viewsCount++;
    res.json({ viewsCount });
});

setInterval(() => {
    const viewsFilePath = path.join(__dirname, 'data', 'views.json');
    fs.writeFileSync(viewsFilePath, JSON.stringify({ viewsCount }));
}, 15000);