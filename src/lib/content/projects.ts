import projectsRaw from "$content/projects.yaml";
import type { GameTheme } from "$lib/themes";

export interface Project {
  name: string;
  description: string;
  image: string;
  author?: string;
  featured?: boolean;
  theme?: GameTheme;
  githubs?: string | string[];
  discord?: string;
  link?: string;
}

export type Projects = Record<string, Project>;

export const projects = projectsRaw as Projects;

export const githubToProject = getGithubToProjectMap();

function getGithubToProjectMap() {
  const map: Record<string, string> = {};

  for (const [projectId, project] of Object.entries(projects)) {
    if (!project.githubs) continue;

    for (const github of Array.isArray(project.githubs) ? project.githubs : [project.githubs]) {
      map[github] = projectId;
    }
  }

  return map;
}
