# skill-hub

用于安装、更新和管理 Claude / Codex agent skills 的 CLI 工具。

## 安装

```bash
npm install -g @eyu1988/skill-hub --registry https://registry.npmjs.org/
```

## 快速开始

```bash
# 一次性配置
skill-hub config set DEFAULT_REPO eyu1988/agent-skills
skill-hub config set DEFAULT_AGENT claude
skill-hub config set GITHUB_TOKEN 你的token   # 可选，避免 GitHub API 频率限制

# 安装所有 skills
skill-hub install
```

## 指令

### install / update

```bash
skill-hub install                          # 从 DEFAULT_REPO 安装所有 skills
skill-hub install owner/repo               # 从指定仓库安装
skill-hub install --skill eyu-record       # 安装单个 skill
skill-hub install --agent codex            # 安装到 Codex
skill-hub update                           # 更新所有 skills
skill-hub update --skill eyu-record        # 更新单个 skill
```

### remove

```bash
skill-hub remove --skill eyu-record        # 删除已安装的 skill
```

### list / search

```bash
skill-hub list                             # 查看本地已安装的 skills
skill-hub search                           # 查看 DEFAULT_REPO 中可用的 skills
skill-hub search owner/repo                # 查看指定仓库中可用的 skills
```

### config

```bash
skill-hub config set DEFAULT_REPO owner/repo   # 默认 GitHub 仓库
skill-hub config set DEFAULT_AGENT claude      # 默认 agent：claude 或 codex
skill-hub config set GITHUB_TOKEN 你的token    # GitHub token，避免 API 频率限制
skill-hub config set CAPTURE_DIR /你的路径     # skill 文件中的路径占位符
skill-hub config set KNOWLEDGE_DIR /你的路径   # skill 文件中的路径占位符
skill-hub config list                          # 查看所有配置
```

## 配置说明

配置存储在 `~/.skill-hub/config.json`，更新 skill-hub 不会影响已有配置。

| 配置项 | 说明 |
|--------|------|
| `DEFAULT_REPO` | 默认安装来源（如 `eyu1988/agent-skills`） |
| `DEFAULT_AGENT` | 默认 agent：`claude` 或 `codex` |
| `GITHUB_TOKEN` | GitHub 个人 token，解决 API 频率限制导致的 403 |
| `CAPTURE_DIR` | 替换 skill 文件中的 `{{CAPTURE_DIR}}` 占位符 |
| `KNOWLEDGE_DIR` | 替换 skill 文件中的 `{{KNOWLEDGE_DIR}}` 占位符 |

## 多设备使用

不同设备按需配置 DEFAULT_AGENT：

**主要使用 Claude 的设备：**
```bash
skill-hub config set DEFAULT_AGENT claude
```

**主要使用 Codex 的设备：**
```bash
skill-hub config set DEFAULT_AGENT codex
```

## Skill 文件格式

Skills 以目录形式存储，每个目录包含一个 `SKILL.md`：

```
repo/
└── claude/
    └── eyu-record/
        └── SKILL.md
```

`SKILL.md` 文件头格式：

```yaml
---
name: eyu-record
version: 1.0.0
description: skill 的简短描述
---
```

Skill 内容中可使用 `{{VAR}}` 占位符，install 时自动替换为配置中的实际路径。

## 工作原理

1. `skill-hub install` 通过 GitHub API 拉取 skill 目录
2. 首次遇到未配置的占位符（如 `{{CAPTURE_DIR}}`）时交互式提示输入
3. 替换占位符后写入 `~/.claude/skills/` 或 `~/.codex/skills/`
