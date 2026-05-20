#!/usr/bin/env node
import { Command } from "commander";
import { install } from "./commands/install";
import { list } from "./commands/list";

const program = new Command();

program
  .name("skill-hub")
  .description("Manage Claude/Codex agent skills")
  .version("0.1.0");

program
  .command("install <repo>")
  .description('Install skills from a GitHub repo (e.g. "eyu1988/agent-skills")')
  .option("-a, --agent <agent>", "Target agent: claude or codex", "claude")
  .action(async (repo, opts) => {
    await install(repo, opts.agent);
  });

program
  .command("update <repo>")
  .description("Update installed skills from a GitHub repo")
  .option("-a, --agent <agent>", "Target agent: claude or codex", "claude")
  .action(async (repo, opts) => {
    await install(repo, opts.agent);
  });

program
  .command("list")
  .description("List installed skills")
  .option("-a, --agent <agent>", "Target agent: claude or codex", "claude")
  .action((opts) => {
    list(opts.agent);
  });

program.parse();
