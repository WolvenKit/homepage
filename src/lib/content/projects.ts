import projectsRaw from "$content/projects.yaml";

export interface Project {
  name: string;
  description: string;
  image: string;
  github?: string;
  link?: string;
}

export type Projects = Record<string, Project>;

export const projects = projectsRaw as Projects;
