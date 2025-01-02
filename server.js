const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const schedule = require('node-schedule');

// Directory containing the repositories
const reposFolder = path.join(__dirname, 'repo');

// Function to create a dummy .js file with legitimate-looking code
function createDummyJsFile(repoPath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(repoPath, `dummy-${timestamp}.js`);
  const content = generateDummyJsContent(filePath);
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(
      `[${new Date().toISOString()}] Dummy .js file created in ${repoPath}: dummy-${timestamp}.js`
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error creating dummy .js file in ${repoPath}:`,
      error
    );
    return null;
  }
  return filePath;
}

// Function to generate dummy .js content with legitimate-looking code
function generateDummyJsContent(filePath) {
  const functions = [
    `function helloWorld() {
      console.log('Hello, world!');
    }`,
    `function add(a, b) {
      return a + b;
    }`,
    `function subtract(a, b) {
      return a - b;
    }`,
    `function multiply(a, b) {
      return a * b;
    }`,
    `function divide(a, b) {
      if (b === 0) {
        throw new Error('Division by zero');
      }
      return a / b;
    }`,
  ];
  const selectedFunctions = functions
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .join('\n\n');
  return `
// filepath: ${filePath}
${selectedFunctions}

module.exports = { helloWorld, add, subtract, multiply, divide };
`;
}

// Function to commit and push changes in a repository
async function commitAndPush(repoPath, filePath) {
  const git = simpleGit(repoPath);
  try {
    console.log(`[${new Date().toISOString()}] Starting commit and push in ${repoPath}`);
    await git.add(filePath);
    console.log(`[${new Date().toISOString()}] File staged in ${repoPath}`);

    const message = `Auto-commit at ${new Date().toLocaleString()}`;
    await git.commit(message);
    console.log(
      `[${new Date().toISOString()}] Changes committed in ${repoPath} with message: ${message}`
    );

    await git.push();
    console.log(`[${new Date().toISOString()}] Changes pushed in ${repoPath}`);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error during Git operations in ${repoPath}:`,
      error
    );
  }
}

// Function to randomly pick a single repository
function pickRandomRepo(repos) {
  const shuffled = repos.sort(() => 0.5 - Math.random());
  return shuffled[0];
}

// Function to automate the process for a single repository
async function automateCommitForRandomRepo() {
  console.log(`[${new Date().toISOString()}] Starting automation for a random repository`);

  if (!fs.existsSync(reposFolder)) {
    console.error(`[${new Date().toISOString()}] Repositories folder not found: ${reposFolder}`);
    return;
  }

  const repos = fs.readdirSync(reposFolder).filter(folder => {
    const repoPath = path.join(reposFolder, folder);
    return (
      fs.statSync(repoPath).isDirectory() &&
      fs.existsSync(path.join(repoPath, '.git'))
    );
  });

  if (repos.length === 0) {
    console.error(`[${new Date().toISOString()}] No repositories found to process.`);
    return;
  }

  // Randomly pick one repository to commit
  const randomRepo = pickRandomRepo(repos);
  const repoPath = path.join(reposFolder, randomRepo);
  console.log(`[${new Date().toISOString()}] Processing random repository: ${randomRepo}`);

  // Create a dummy .js file
  const dummyFilePath = createDummyJsFile(repoPath);
  if (dummyFilePath) {
    await commitAndPush(repoPath, dummyFilePath); // Commit and push changes
  }

  console.log(`[${new Date().toISOString()}] Finished automation for the random repository`);
}

// Schedule 5-10 runs per day at random times
function scheduleRandomRuns() {
  const runCount = Math.floor(Math.random() * 6) + 5; // Random number between 5 and 10
  console.log(`[${new Date().toISOString()}] Scheduling ${runCount} runs for today.`);

  const now = new Date();
  for (let i = 0; i < runCount; i++) {
    const randomHour = Math.floor(Math.random() * (23 - 9 + 1)) + 9; // Between 9 AM and 11 PM
    const randomMinute = Math.floor(Math.random() * 60); // Any minute
    const runTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), randomHour, randomMinute);

    schedule.scheduleJob(runTime, () => {
      console.log(`[${new Date().toISOString()}] Scheduled run triggered.`);
      automateCommitForRandomRepo();
    });

    console.log(`[${new Date().toISOString()}] Scheduled a run at ${runTime}`);
  }
}

// Start the scheduling
scheduleRandomRuns();
