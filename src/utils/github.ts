import axios from "axios";
import { loadConfig } from "./config";

export interface SkillDir {
  name: string;
  content: string;
}

function getHeaders(): Record<string, string> {
  const { githubToken } = loadConfig();
  return githubToken ? { Authorization: `Bearer ${githubToken}` } : {};
}

async function fetchDir(owner: string, repo: string, dirPath: string): Promise<SkillDir[]> {
  const headers = getHeaders();
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}`;
  const { data } = await axios.get(apiUrl, { headers });
  const skills: SkillDir[] = [];

  for (const item of data) {
    if (item.type === "dir") {
      const { data: subData } = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/${item.path}`,
        { headers }
      );
      const skillFile = subData.find((f: any) => f.name === "SKILL.md");
      if (skillFile) {
        const { data: content } = await axios.get(skillFile.download_url, { headers });
        skills.push({ name: item.name, content });
      }
    }
  }

  return skills;
}

export async function fetchSkills(repo: string, agent: string): Promise<SkillDir[]> {
  const [owner, repoName] = repo.split("/");
  return fetchDir(owner, repoName, agent);
}

export async function fetchSkillNames(repo: string, agent: string): Promise<string[]> {
  const [owner, repoName] = repo.split("/");
  const { data } = await axios.get(
    `https://api.github.com/repos/${owner}/${repoName}/contents/${agent}`,
    { headers: getHeaders() }
  );
  return data.filter((item: any) => item.type === "dir").map((item: any) => item.name);
}
