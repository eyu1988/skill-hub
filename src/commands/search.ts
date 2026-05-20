import chalk from "chalk";
import { fetchSkillNames } from "../utils/github";

export async function search(repo: string, agent: string) {
  console.log(chalk.blue(`Available skills in ${repo} for ${agent}:\n`));
  const names = await fetchSkillNames(repo, agent);

  if (names.length === 0) {
    console.log(chalk.yellow("No skills found."));
    return;
  }

  names.forEach((name) => console.log(chalk.green(`  • ${name}`)));
}
