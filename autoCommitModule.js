const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

// Path to the text file to modify
const filePath = path.join(__dirname, 'file.txt');

// Initialize simple-git
const git = simpleGit();

async function modifyAndPush() {
    try {
        // Step 1: Modify the text file
        const timestamp = new Date().toISOString();
        const newContent = `Last updated: ${timestamp}\n`;
        fs.appendFileSync(filePath, newContent, 'utf8');
        console.log('File updated successfully.');

        // Step 2: Stage the changes
        await git.add(filePath);
        console.log('File staged.');

        // Step 3: Commit the changes
        await git.commit(`Update: ${timestamp}`);
        console.log('Changes committed.');

        // Step 4: Push the changes
        await git.push();
        console.log('Changes pushed to the repository.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Call the function when the module starts
modifyAndPush();
