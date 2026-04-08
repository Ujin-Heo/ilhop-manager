# GitHub Repository Creation & Publishing Guide

Steps to publish an existing project (like a monorepo) to a new GitHub repository.

## 1. Initialize Local Git
Initialize a new Git repository in the root directory.
```bash
git init
```

## 2. Clean Up Nested Repositories (Optional)
If your subdirectories (e.g., `backend/`, `frontend/`) have their own `.git` folders, remove them to combine everything into a single repository (monorepo style).
```bash
rm -rf backend/.git frontend/.git
```

## 3. Stage and Commit
Add all project files and create the initial commit.
```bash
git add .
git commit -m "Initial commit"
```

## 4. Create and Push to GitHub
Use the GitHub CLI (`gh`) to create the repository and push the local commits.
```bash
gh repo create <repo-name> --public --source=. --remote=origin --push
```

*Note: If creating via the GitHub website manually:*
```bash
git remote add origin https://github.com/username/repo-name.git
git branch -M main
git push -u origin main
```

## 5. Verification
Verify that the remote and branch are set correctly.
```bash
git remote -v
git branch -a
```
