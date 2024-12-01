const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const schedule = require('node-schedule');

// Initialize Git
const git = simpleGit();

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

commitAndPush()