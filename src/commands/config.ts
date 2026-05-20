import chalk from "chalk";
import { loadConfig, saveConfig } from "../utils/config";

export function configSet(key: string, value: string) {
  const config = loadConfig();
  config.vars[key] = value;
  saveConfig(config);
  console.log(chalk.green(`✓ ${key} = ${value}`));
}

export function configList() {
  const config = loadConfig();
  const entries = Object.entries(config.vars);
  if (entries.length === 0) {
    console.log(chalk.yellow("No config vars set. Use: skill-hub config set KEY VALUE"));
    return;
  }
  console.log(chalk.blue("Config vars:\n"));
  entries.forEach(([k, v]) => console.log(`  ${chalk.bold(k)} = ${v}`));
}
