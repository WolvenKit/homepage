import projectsRaw from "$content/projects.yaml";
import type { GameTheme } from "$lib/themes";

export interface Project {
  name: string;
  description: string;
  image: string;
  featured?: boolean;
  theme?: GameTheme;
  github?: string | string[];
  link?: string;
}

export type Projects = Record<string, Project>;

export const projects = projectsRaw as Projects;

export const githubToProject = getGithubToProjectMap();

function getGithubToProjectMap() {
  const map: Record<string, string> = {};

  for (const [projectId, project] of Object.entries(projects)) {
    if (!project.github) continue;

    for (const github of Array.isArray(project.github) ? project.github : [project.github]) {
      map[github] = projectId;
    }
  }

  return map;
}
