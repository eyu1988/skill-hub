import * as os from "os";
import * as path from "path";

export const AGENT_PATHS: Record<string, string> = {
  claude: path.join(os.homedir(), ".claude", "skills"),
  codex: path.join(os.homedir(), ".codex", "skills"),
};

export function getSkillDir(agent: string): string {
  const dir = AGENT_PATHS[agent];
  if (!dir) throw new Error(`Unknown agent: ${agent}. Use "claude" or "codex".`);
  return dir;
}
