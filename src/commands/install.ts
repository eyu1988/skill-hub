import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { fetchSkills } from "../utils/github";
import { getSkillDir } from "../utils/paths";

export async function install(repo: string, agent: string) {
  console.log(chalk.blue(`Installing skills from ${repo} for ${agent}...`));

  const skillDir = getSkillDir(agent);
  fs.mkdirSync(skillDir, { recursive: true });

  const skills = await fetchSkills(repo);
  if (skills.length === 0) {
    console.log(chalk.yellow("No .md skill files found in the repo."));
    return;
  }

  for (const skill of skills) {
    const dest = path.join(skillDir, skill.name);
    fs.writeFileSync(dest, skill.content, "utf-8");
    console.log(chalk.green(`✓ ${skill.name}`));
  }

  console.log(chalk.green(`\nInstalled ${skills.length} skill(s) to ${skillDir}`));
}
