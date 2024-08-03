import { GITHUB_ORG } from "$env/static/private";

const GITHUB_API_URL = "https://api.github.com";

export interface GithubUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
}

export async function findUsers(names: string[]): Promise<Record<string, GithubUser>> {
  const url = new URL("/search/users", GITHUB_API_URL);
  url.searchParams.set("q", names.map((v) => "user:" + v).join(" "));

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not fetch GitHub users: " + response.status + ": " + response.statusText);
  }

  const result = await response.json();

  if (result.incomplete_results) console.warn("GITHUB FIND USERS INCOMPLETE RESULTS!!");

  const users: Record<string, GithubUser> = {};
  for (const user of result.items) {
    users[user.login] = user;
  }

  return users;
}

export async function findContributions(author: string): Promise<GithubRepository[]> {
  const url = new URL(`/search/commits`, GITHUB_API_URL);
  url.searchParams.set("q", `org:${GITHUB_ORG} author:${author}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not fetch GitHub contributions: " + response.status + ": " + response.statusText);
  }

  const result = await response.json();

  if (result.incomplete_results) console.warn("GITHUB FIND CONTRIBUTIONS INCOMPLETE RESULTS!!");

  const repositories: Record<string, GithubRepository> = {};
  for (const commit of result.items) {
    repositories[commit.repository.id] = commit.repository;
  }

  return Object.values(repositories);
}
