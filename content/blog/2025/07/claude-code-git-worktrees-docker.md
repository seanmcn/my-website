---
title: "Parallel Claude Code with Git Worktrees"
type: 'post'
date: '2025-07-23'
slug: '2025/07/claude-code-git-worktrees-docker'
category: 'productivity'
tags: ['ai', 'claude-code', 'git-worktrees', 'docker']
featured: 'images/featured-claude-code-git-worktrees-docker.png'
summary: 'How I run several Claude Code sessions at once, each in its own git worktree with its own Docker containers, so nothing ever needs stashing.'
margins:
  - label: 'In one line'
    text: 'Give each task its own worktree, containers and Claude Code session, and switching task is just a cd.'
  - label: 'The catch'
    text: "Separate worktrees still share your machine's ports, so the second one to start fails. Give each worktree its own ports up front."
---

For the last few months I've been running several [Claude Code](https://claude.ai/code) sessions at once, each on a different task in the same repository. What makes that work is [git worktrees](https://git-scm.com/docs/git-worktree) plus [Docker](https://www.docker.com/): every task gets its own directory and branch, and its own set of containers, so nothing has to be stashed when something urgent comes in.

Before this, I'd be in the middle of one thing when something more urgent landed. I'd stash my changes, switch branches, deal with it, switch back and try to remember where I'd got to (not fun). I also had far too many terminal tabs open and regularly lost track of which branch had which changes.

## Git worktrees

A worktree is an extra checkout of the same repository in another directory. Each one has its own branch, working files and index (the staging area), but they all share the original clone's `.git` folder, so every commit and branch is visible from all of them. Instead of switching branches, you switch directories.

My usual setup keeps the original clone on `main` and adds a worktree per task:

```bash
# Run from myproject/, which stays on main
git worktree add ../myproject-feature-auth feature/user-authentication
git worktree add ../myproject-hotfix-db hotfix/database-connection
```

That gives me three directories side by side:

- `myproject/` - the main branch
- `myproject-feature-auth/` - the authentication feature
- `myproject-hotfix-db/` - the database hotfix

The original clone stays as the `main` one because git won't check out the same branch in two worktrees. Try to add a worktree for `main` while the original clone is on it and you get:

```
fatal: 'main' is already used by worktree at '/path/to/myproject'
```

## Docker in each worktree

Each worktree can run its own copy of the app's containers, so a branch that changes dependencies or the database doesn't affect the others.

Docker Compose names a project after the directory you run it from, so `docker compose up -d` in `myproject-feature-auth/` and again in `myproject-hotfix-db/` gives you two separate sets of containers, networks and volumes without any extra flags. If you want a different name, `-p` (or `--project-name`) goes before `up`. Put it after and Compose fails with `unknown flag: --project-name`.

```bash
docker compose -p hotfix-db up -d
```

The catch is ports. A project name doesn't change the host ports in your compose file, so the second worktree to come up fails with:

```
Bind for 0.0.0.0:8080 failed: port is already allocated
```

I'd give each worktree its own ports before you hit that. The easiest way is to read the port from a variable in `compose.yaml`, with a default:

```yaml
services:
  web:
    ports:
      - "${WEB_PORT:-8080}:80"
```

Then set it when you bring a worktree up:

```bash
WEB_PORT=8081 docker compose up -d
```

## Where Claude Code fits in

Claude Code works on whatever directory you start it in. With a worktree per task, I can run a session in each one, and each session only sees its own branch's code.

### Fixing a bug in the middle of a feature

Say I'm working on a new authentication system when a database connection issue gets reported. Instead of stashing the auth work:

1. `cd ../myproject-hotfix-db`
2. Start Claude Code there with `claude`
3. Work with Claude to find and fix the database issue
4. Deploy the fix

The auth worktree, and the Claude session running in it, are exactly where I left them.

### Reviewing a pull request

When I'm reviewing a colleague's pull request, I check it out in a temporary worktree:

```bash
git worktree add ../myproject-review feature/colleague-work
cd ../myproject-review
claude
```

Claude Code helps me understand the changes, suggest improvements and write review comments, while my own work carries on in the other worktrees. Once the review's done, I remove the worktree:

```bash
cd ../myproject
git worktree remove ../myproject-review
```

## A typical day

In the morning I start a session in each worktree I'm working in, each in its own terminal:

```bash
# Terminal 1: main
cd ~/projects/myproject
claude

# Terminal 2: the feature I'm on
cd ~/projects/myproject-feature-xyz
claude
```

When a hotfix comes in, it gets a new branch, a worktree, its own containers and a session:

```bash
git worktree add -b hotfix/urgent-fix \
  ../myproject-hotfix-urgent main
cd ../myproject-hotfix-urgent
WEB_PORT=8082 docker compose up -d
claude
```

Each session only knows about its own worktree, so its suggestions match the state of that branch. Claude Code also saves conversations per directory, so if I close a terminal, `claude --continue` in that worktree picks up the conversation I was having there.

The biggest difference for me is that I don't lose track of what I was doing. Each worktree keeps its own state and each Claude session keeps its own understanding of the task, so changing task is a `cd` rather than a stash, a checkout and trying to remember where I was. I can have Claude working on two features at once, and each worktree runs its own tests and containers without getting in the way of the others.

## The downsides

Disk space is the main one. Worktrees share the repository's history, so git itself doesn't take much extra space, but every worktree has its own copy of the checked-out files plus whatever you install or build in it: `node_modules`, virtual environments, build output and Docker volumes. With a few worktrees of a big project, that adds up quickly.

A new worktree also only has the files git tracks. You'll need to install dependencies again, and copy or symlink anything gitignored that the app needs, like a `.env` file.

It takes a little while to get used to having several worktrees on the go, too. `git worktree list` shows what's checked out where, which helps.

The tools are all free apart from the Claude Code subscription, and the setup only takes a few minutes. If you find yourself switching between features a lot, I'd recommend giving it a try.
