import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { fetchSkills } from "../utils/github";
import { getSkillDir } from "../utils/paths";
import { loadConfig, applyVars } from "../utils/config";

export async function install(repo: string, agent: string) {
  console.log(chalk.blue(`Installing skills from ${repo} for ${agent}...`));

  const skillDir = getSkillDir(agent);
  fs.mkdirSync(skillDir, { recursive: true });

  const { vars } = loadConfig();
  const skills = await fetchSkills(repo, agent);

  if (skills.length === 0) {
    console.log(chalk.yellow("No skills found in the repo."));
    return;
  }

  for (const skill of skills) {
    const skillDir2 = path.join(skillDir, skill.name);
    fs.mkdirSync(skillDir2, { recursive: true });
    const content = applyVars(skill.content, vars);
    fs.writeFileSync(path.join(skillDir2, "SKILL.md"), content, "utf-8");
    console.log(chalk.green(`✓ ${skill.name}`));
  }

  console.log(chalk.green(`\nInstalled ${skills.length} skill(s) to ${skillDir}`));

  const unresolved = skills.some((s) => applyVars(s.content, vars).includes("{{"));
  if (unresolved) {
    console.log(chalk.yellow("\n⚠ Some placeholders were not replaced. Run:"));
    console.log(chalk.yellow("  skill-hub config set CAPTURE_DIR /your/path"));
    console.log(chalk.yellow("  skill-hub config set KNOWLEDGE_DIR /your/path"));
    console.log(chalk.yellow("Then reinstall to apply."));
  }
}
