import * as fs from "fs";
import chalk from "chalk";
import { getSkillDir } from "../utils/paths";

export function list(agent: string) {
  const skillDir = getSkillDir(agent);

  if (!fs.existsSync(skillDir)) {
    console.log(chalk.yellow(`No skills installed for ${agent}.`));
    return;
  }

  const files = fs.readdirSync(skillDir).filter((f) => f.endsWith(".md"));
  if (files.length === 0) {
    console.log(chalk.yellow(`No skills found in ${skillDir}.`));
    return;
  }

  console.log(chalk.blue(`Skills for ${agent} (${skillDir}):\n`));
  files.forEach((f) => console.log(chalk.green(`  • ${f}`)));
}
