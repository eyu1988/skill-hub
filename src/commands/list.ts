import * as fs from "fs";
import chalk from "chalk";
import { getSkillDir } from "../utils/paths";

export function list(agent: string) {
  const skillDir = getSkillDir(agent);

  if (!fs.existsSync(skillDir)) {
    console.log(chalk.yellow(`No skills installed for ${agent}.`));
    return;
  }

  const skills = fs.readdirSync(skillDir).filter((f) => {
    const stat = fs.statSync(`${skillDir}/${f}`);
    return stat.isDirectory();
  });

  if (skills.length === 0) {
    console.log(chalk.yellow(`No skills installed for ${agent}.`));
    return;
  }

  console.log(chalk.blue(`Skills for ${agent} (${skillDir}):\n`));
  skills.forEach((f) => console.log(chalk.green(`  • ${f}`)));
}
