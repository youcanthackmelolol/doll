const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const VIEWER_COUNTS_FILE = path.join(__dirname, 'viewer_counts.json');

app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Initialize viewer counts if file doesn't exist
if (!fs.existsSync(VIEWER_COUNTS_FILE)) {
    const initialCounts = {
        'index': 0,
        'alo': 0,
        'amb': 0
    };
    fs.writeFileSync(VIEWER_COUNTS_FILE, JSON.stringify(initialCounts, null, 2));
}

// Helper function to read viewer counts
function readViewerCounts() {
    try {
        const data = fs.readFileSync(VIEWER_COUNTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading viewer counts file:', error);
        return { 'index': 0, 'alo': 0, 'amb': 0 }; // Return default in case of error
    }
}

// Helper function to write viewer counts
function writeViewerCounts(counts) {
    try {
        fs.writeFileSync(VIEWER_COUNTS_FILE, JSON.stringify(counts, null, 2));
    } catch (error) {
        console.error('Error writing viewer counts file:', error);
    }
}

app.get('/viewer-count', (req, res) => {
    const page = req.query.page || 'index'; // Default to 'index' if no page specified
    const counts = readViewerCounts();
    const count = counts[page] !== undefined ? counts[page] : 0;
    res.json({ count });
});

app.post('/viewer-count/increment', (req, res) => {
    const page = req.body.page || 'index'; // Default to 'index' if no page specified
    const counts = readViewerCounts();
    if (counts[page] === undefined) {
        counts[page] = 0; // Initialize if page not found
    }
    counts[page]++;
    writeViewerCounts(counts);
    res.json({ count: counts[page] });
});

app.listen(PORT, () => {
    console.log(`Viewer count server running on http://localhost:${PORT}`);
    console.log('To start the server, run `node server/index.js` in your terminal.');
});
