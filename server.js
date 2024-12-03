const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const schedule = require('node-schedule');
const express = require('express');
const http = require('http');

// Initialize Git
const git = simpleGit();

// Directory to store the daily file
const folderPath = path.join(__dirname, 'daily-commits');
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log('Directory created: daily-commits');
}

// Path to the daily log file
const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
const filePath = path.join(folderPath, `log-${today}.txt`);

// Ensure the file exists
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `Daily log for ${today}\n`, 'utf8');
    console.log(`File created: log-${today}.txt`);
}

// Function to update the file
function updateFile() {
    const timestamp = new Date().toLocaleString();
    const content = `Update made at ${timestamp}\n`;
    fs.appendFileSync(filePath, content, 'utf8');
    console.log(`File updated with timestamp: ${timestamp}`);
}

// Function to commit and push the changes
async function commitAndPush() {
    try {
        await git.add(filePath);
        console.log('File staged.');

        const message = `Auto-commit at ${new Date().toLocaleString()}`;
        await git.commit(message);
        console.log('Changes committed with message:', message);

        await git.push();
        console.log('Changes pushed to the repository.');
    } catch (error) {
        console.error('Error during Git operations:', error);
    }
}

// Function to handle the entire process
async function automateCommit() {
    updateFile(); // Update the file with the current timestamp
    await commitAndPush(); // Commit and push the update
}

// Schedule commits at specific times (e.g., hourly)
const commitTimes = [
    '0 8 * * *',  // 8:00 AM
    '0 9 * * *',  // 9:00 AM
    '0 10 * * *', // 10:00 AM
    '0 11 * * *', // 11:00 AM
    '0 12 * * *', // 12:00 PM
    '0 13 * * *', // 1:00 PM
    '0 14 * * *', // 2:00 PM
    '0 15 * * *', // 3:00 PM
    '0 16 * * *', // 4:00 PM
    '0 17 * * *', // 5:00 PM
    '0 18 * * *', // 6:00 PM
    '0 19 * * *', // 7:00 PM
    '0 20 * * *', // 8:00 PM
    '0 21 * * *', // 9:00 PM
    '0 22 * * *', // 10:00 PM
];

// Schedule each commit
commitTimes.forEach((time) => {
    schedule.scheduleJob(time, () => {
        console.log(`Scheduled commit at: ${time}`);
        automateCommit();
    });
});

// Express App Setup
const app = express();
const PORT = 3300;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route that serves HTML to check if the server is live
app.get('/', (req, res) => {
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Server Status</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    color: #333;
                    text-align: center;
                    margin-top: 50px;
                }
                h1 {
                    color: green;
                }
                p {
                    font-size: 18px;
                }
                .status {
                    font-size: 20px;
                    font-weight: bold;
                    color: #4CAF50;
                }
            </style>
        </head>
        <body>
            <h1>Automated Commit Server</h1>
            <p class="status">Server is running and live!</p>
            <p>Commit scheduling is active, and changes will be pushed automatically.</p>
        </body>
        </html>
    `);
});

// Route to manually trigger commit and push
app.post('/trigger-commit', async (req, res) => {
    try {
        console.log('Manual commit triggered.');
        await automateCommit();  // Trigger the commit and push process
        res.status(200).send({ message: 'Commit and push successful!' });
    } catch (error) {
        console.error('Error during manual commit:', error);
        res.status(500).send({ message: 'Failed to commit and push changes.' });
    }
});

// Start the server
http.createServer(app).listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
