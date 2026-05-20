import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import chalk from "chalk";
import { fetchSkills } from "../utils/github";
import { getSkillDir } from "../utils/paths";
import { loadConfig, saveConfig, applyVars } from "../utils/config";

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function collectPlaceholders(content: string): string[] {
  const matches = content.match(/\{\{(\w+)\}\}/g) ?? [];
  return [...new Set(matches.map((m) => m.slice(2, -2)))];
}

export async function install(repo: string, agent: string, skillName?: string) {
  const target = skillName ? `${repo}/${skillName}` : repo;
  console.log(chalk.blue(`Installing skills from ${target} for ${agent}...`));

  const skillDir = getSkillDir(agent);
  fs.mkdirSync(skillDir, { recursive: true });

  let skills = await fetchSkills(repo, agent);
  if (skills.length === 0) {
    console.log(chalk.yellow("No skills found in the repo."));
    return;
  }

  if (skillName) {
    skills = skills.filter((s) => s.name === skillName);
    if (skills.length === 0) {
      console.log(chalk.yellow(`Skill "${skillName}" not found in ${repo}/${agent}/`));
      return;
    }
  }

  // 收集所有 skill 里用到的占位符
  const allContent = skills.map((s) => s.content).join("\n");
  const placeholders = collectPlaceholders(allContent);

  // 对未配置的占位符交互式询问
  const config = loadConfig();
  for (const key of placeholders) {
    if (!config.vars[key]) {
      const value = await prompt(chalk.cyan(`Enter value for ${key}: `));
      if (value) {
        config.vars[key] = value;
        console.log(chalk.green(`✓ ${key} saved`));
      }
    }
  }
  saveConfig(config);

  // 写入 skill 文件并替换占位符
  for (const skill of skills) {
    const dir = path.join(skillDir, skill.name);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "SKILL.md"), applyVars(skill.content, config.vars), "utf-8");
    console.log(chalk.green(`✓ ${skill.name}`));
  }

  console.log(chalk.green(`\nInstalled ${skills.length} skill(s) to ${skillDir}`));
}
