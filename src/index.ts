#!/usr/bin/env node
import { Command } from "commander";
import { install } from "./commands/install";
import { list } from "./commands/list";
import { remove } from "./commands/remove";
import { search } from "./commands/search";
import { configSet, configList } from "./commands/config";
import { loadConfig } from "./utils/config";

function resolveRepo(repo?: string): string {
  if (repo) return repo;
  const { defaultRepo } = loadConfig();
  if (defaultRepo) return defaultRepo;
  console.error("Error: <repo> is required or set a default with: skill-hub config set DEFAULT_REPO owner/repo");
  process.exit(1);
}

const program = new Command();

program
  .name("skill-hub")
  .description("Manage Claude/Codex agent skills")
  .version("0.1.0");

program
  .command("install [repo]")
  .description('Install skills from a GitHub repo (e.g. "eyu1988/agent-skills"), defaults to DEFAULT_REPO')
  .option("-a, --agent <agent>", "Target agent: claude or codex", "claude")
  .option("-s, --skill <skill>", "Install a single skill by name")
  .action(async (repo, opts) => {
    await install(resolveRepo(repo), opts.agent, opts.skill);
  });

program
  .command("update [repo]")
  .description("Update installed skills from a GitHub repo, defaults to DEFAULT_REPO")
  .option("-a, --agent <agent>", "Target agent: claude or codex", "claude")
  .option("-s, --skill <skill>", "Update a single skill by name")
  .action(async (repo, opts) => {
    await install(resolveRepo(repo), opts.agent, opts.skill);
  });

program
  .command("list")
  .description("List installed skills")
  .option("-a, --agent <agent>", "Target agent: claude or codex", "claude")
  .action((opts) => {
    list(opts.agent);
  });

program
  .command("remove")
  .description("Remove an installed skill")
  .requiredOption("-s, --skill <skill>", "Skill name to remove")
  .option("-a, --agent <agent>", "Target agent: claude or codex", "claude")
  .action((opts) => {
    remove(opts.agent, opts.skill);
  });

program
  .command("search [repo]")
  .description("List available skills in a GitHub repo, defaults to DEFAULT_REPO")
  .option("-a, --agent <agent>", "Target agent: claude or codex", "claude")
  .action(async (repo, opts) => {
    await search(resolveRepo(repo), opts.agent);
  });

const config = program.command("config").description("Manage config variables for skill placeholders");

config
  .command("set <key> <value>")
  .description("Set a config variable (e.g. CAPTURE_DIR, KNOWLEDGE_DIR)")
  .action((key, value) => {
    configSet(key, value);
  });

config
  .command("list")
  .description("List all config variables")
  .action(() => {
    configList();
  });

program.parse();
