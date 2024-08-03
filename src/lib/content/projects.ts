import projectsRaw from "$content/projects.yaml";
import type { GameTheme } from "$lib/themes";

export interface Project {
  name: string;
  description: string;
  image: string;
  featured?: boolean;
  theme?: GameTheme;
  github?: string;
  link?: string;
}

export type Projects = Record<string, Project>;

export const projects = projectsRaw as Projects;
