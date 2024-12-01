---

# Automated Git Commit and Push Scheduler

This Node.js application automates the process of modifying a file, committing changes, and pushing them to a Git repository at scheduled intervals. It is useful for maintaining GitHub contribution streaks or for automating routine updates to a file.

---

## Features

- Automatically updates a log file with a timestamp.
- Commits changes to a Git repository with an appropriate message.
- Pushes changes to the remote repository.
- Easy scheduling using `node-schedule`.

---

## Prerequisites

Before running the application, ensure the following:

1. **Node.js and npm** are installed.
   - [Download and install Node.js](https://nodejs.org/).
2. A **Git repository** is initialized in the project directory:
   ```bash
   git init
   ```
3. A remote repository is linked to the local Git repository:
   ```bash
   git remote add origin <your-repo-url>
   ```

---

## Installation

1. Clone the repository or copy the script files into your project directory:
   ```bash
   git clone <repo-url>
   cd automated-git-committer
   ```

2. Install the required npm packages:
   ```bash
   npm install
   ```

3. Set up the directory structure:
   - The script will automatically create a `daily-commits` folder if it does not exist.

---

## Usage

1. **Run the Script**:
   Start the application by running the following command:
   ```bash
   node server.js
   ```

2. **What It Does**:
   - The application creates a daily log file (`log-YYYY-MM-DD.txt`) inside the `daily-commits` folder.
   - It appends a timestamp to the file at specified intervals.
   - Each timestamp is committed and pushed to the remote repository immediately.

3. **Scheduling**:
   - The script is preconfigured to make 15 commits daily, every hour from 8:00 AM to 10:00 PM.
   - You can modify the schedule in the `commitTimes` array in `server.js`:
     ```javascript
     const commitTimes = [
         '0 8 * * *',  // 8:00 AM
         '0 9 * * *',  // 9:00 AM
         ...
     ];
     ```

---

## Customization

- **Change Commit Frequency**:
  Update the `commitTimes` array to suit your requirements using cron syntax.
- **Modify File Content**:
  Edit the `updateFile` function in `server.js` to customize how the file is updated.

---

## Logs and Debugging

- **Console Logs**:
  The application logs its operations (file update, commit, push) to the terminal.
- **Error Handling**:
  Errors during Git operations are logged in the terminal for troubleshooting.

---

## Example Output

Each commit includes a log file update and a commit message, such as:

### Updated File Content:
```
Daily log for 2024-12-01
Update made at 12/1/2024, 8:00:00 AM
Update made at 12/1/2024, 9:00:00 AM
```

### Git Commit Message:
```
Auto-commit at 12/1/2024, 9:00:00 AM
```

---

## Notes

- Ensure you have push access to the remote repository.
- The server must remain running for scheduled tasks to execute.
- You can use a process manager like `PM2` to keep the script running:
  ```bash
  npm install -g pm2
  pm2 start server.js
  ```

---

## License

This project is licensed under the [MIT License](LICENSE).

--- 

## Contributions

Feel free to submit issues or pull requests to improve the project.

--- 
