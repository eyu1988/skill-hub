import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { getSkillDir } from "../utils/paths";

export function remove(agent: string, skillName: string) {
  const skillDir = path.join(getSkillDir(agent), skillName);

  if (!fs.existsSync(skillDir)) {
    console.log(chalk.yellow(`Skill "${skillName}" is not installed for ${agent}.`));
    return;
  }

  fs.rmSync(skillDir, { recursive: true, force: true });
  console.log(chalk.green(`✓ Removed ${skillName} from ${agent}`));
}
