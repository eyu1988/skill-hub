# skill-hub

A CLI tool to install, update, and manage agent skills for Claude and Codex.

## Install

```bash
npm install -g @eyu1988/skill-hub --registry https://registry.npmjs.org/
```

## Quick Start

```bash
# Set defaults (one-time setup)
skill-hub config set DEFAULT_REPO eyu1988/agent-skills
skill-hub config set DEFAULT_AGENT claude
skill-hub config set GITHUB_TOKEN your_token   # optional, avoids GitHub API rate limiting

# Install all skills
skill-hub install
```

## Commands

### install / update

```bash
skill-hub install                          # Install all skills from DEFAULT_REPO
skill-hub install owner/repo               # Install from a specific repo
skill-hub install --skill eyu-record       # Install a single skill
skill-hub install --agent codex            # Install for Codex
skill-hub update                           # Update all skills
skill-hub update --skill eyu-record        # Update a single skill
```

### remove

```bash
skill-hub remove --skill eyu-record        # Remove an installed skill
```

### list / search

```bash
skill-hub list                             # List locally installed skills
skill-hub search                           # List available skills in DEFAULT_REPO
skill-hub search owner/repo                # List available skills in a specific repo
```

### config

```bash
skill-hub config set DEFAULT_REPO owner/repo   # Default GitHub repo
skill-hub config set DEFAULT_AGENT claude      # Default agent: claude or codex
skill-hub config set GITHUB_TOKEN your_token   # GitHub token to avoid rate limiting
skill-hub config set CAPTURE_DIR /your/path    # Path placeholder for skills
skill-hub config set KNOWLEDGE_DIR /your/path  # Path placeholder for skills
skill-hub config list                          # Show all config
```

## Config

Config is stored in `~/.skill-hub/config.json` and persists across installs.

| Key | Description |
|-----|-------------|
| `DEFAULT_REPO` | GitHub repo to install skills from (e.g. `eyu1988/agent-skills`) |
| `DEFAULT_AGENT` | Default agent: `claude` or `codex` |
| `GITHUB_TOKEN` | Personal access token to avoid GitHub API rate limiting |
| `CAPTURE_DIR` | Replaces `{{CAPTURE_DIR}}` placeholder in skill files |
| `KNOWLEDGE_DIR` | Replaces `{{KNOWLEDGE_DIR}}` placeholder in skill files |

## Skill File Format

Skills are stored as directories with a `SKILL.md` file:

```
repo/
└── claude/
    └── eyu-record/
        └── SKILL.md
```

`SKILL.md` frontmatter:

```yaml
---
name: eyu-record
version: 1.0.0
description: Short description of the skill
---
```

Use `{{VAR}}` placeholders in skill content — they are replaced at install time using your config values.

## How It Works

1. `skill-hub install` fetches skill directories from GitHub via the API
2. Missing config vars (`{{CAPTURE_DIR}}` etc.) are prompted interactively
3. Placeholders are replaced and skill files are written to `~/.claude/skills/` or `~/.codex/skills/`
