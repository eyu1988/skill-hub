import axios from "axios";

export interface SkillFile {
  name: string;
  content: string;
}

export async function fetchSkills(repo: string): Promise<SkillFile[]> {
  // repo format: "owner/repo" or "owner/repo/subpath"
  const parts = repo.split("/");
  const owner = parts[0];
  const repoName = parts[1];
  const subpath = parts.slice(2).join("/") || "";

  const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/${subpath}`;
  const { data } = await axios.get(apiUrl);

  const files: SkillFile[] = [];
  for (const item of data) {
    if (item.type === "file" && item.name.endsWith(".md")) {
      const { data: fileData } = await axios.get(item.download_url);
      files.push({ name: item.name, content: fileData });
    }
  }
  return files;
}
