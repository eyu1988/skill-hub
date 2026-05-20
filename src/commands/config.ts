import chalk from "chalk";
import { loadConfig, saveConfig } from "../utils/config";

export function configSet(key: string, value: string) {
  const config = loadConfig();
  if (key === "DEFAULT_REPO") {
    config.defaultRepo = value;
  } else if (key === "DEFAULT_AGENT") {
    config.defaultAgent = value;
  } else {
    config.vars[key] = value;
  }
  saveConfig(config);
  console.log(chalk.green(`✓ ${key} = ${value}`));
}

export function configList() {
  const config = loadConfig();
  if (config.defaultRepo) console.log(chalk.blue(`DEFAULT_REPO  = ${config.defaultRepo}`));
  if (config.defaultAgent) console.log(chalk.blue(`DEFAULT_AGENT = ${config.defaultAgent}`));
  if (config.defaultRepo || config.defaultAgent) console.log();
  const entries = Object.entries(config.vars);
  if (entries.length === 0 && !config.defaultRepo && !config.defaultAgent) {
    console.log(chalk.yellow("No config vars set. Use: skill-hub config set KEY VALUE"));
    return;
  }
  if (entries.length > 0) {
    console.log(chalk.blue("Config vars:\n"));
    entries.forEach(([k, v]) => console.log(`  ${chalk.bold(k)} = ${v}`));
  }
}
