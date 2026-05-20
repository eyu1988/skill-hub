import axios from "axios";

export interface SkillDir {
  name: string;
  content: string;
}

async function fetchDir(owner: string, repo: string, dirPath: string): Promise<SkillDir[]> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}`;
  const { data } = await axios.get(apiUrl);
  const skills: SkillDir[] = [];

  for (const item of data) {
    if (item.type === "dir") {
      const subUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${item.path}`;
      const { data: subData } = await axios.get(subUrl);
      const skillFile = subData.find((f: any) => f.name === "SKILL.md");
      if (skillFile) {
        const { data: content } = await axios.get(skillFile.download_url);
        skills.push({ name: item.name, content });
      }
    }
  }

  return skills;
}

export async function fetchSkills(repo: string, agent: string): Promise<SkillDir[]> {
  const parts = repo.split("/");
  const owner = parts[0];
  const repoName = parts[1];
  return fetchDir(owner, repoName, agent);
}

export async function fetchSkillNames(repo: string, agent: string): Promise<string[]> {
  const parts = repo.split("/");
  const owner = parts[0];
  const repoName = parts[1];
  const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/${agent}`;
  const { data } = await axios.get(apiUrl);
  return data.filter((item: any) => item.type === "dir").map((item: any) => item.name);
}
