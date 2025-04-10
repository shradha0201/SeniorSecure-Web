// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Save form data
app.post('/submit', (req, res) => {
    const data = req.body;

    fs.readFile('responses.json', 'utf8', (err, fileData) => {
        let existing = [];
        if (!err && fileData) {
            existing = JSON.parse(fileData);
        }
        existing.push(data);
        fs.writeFile('responses.json', JSON.stringify(existing, null, 2), () => {
            res.json({ status: "saved" });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
