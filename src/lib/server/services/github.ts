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

export async function fetchGithubUsers(names: string[]): Promise<GithubUser[]> {
  // Clone the array
  names = [...names];

  const users: GithubUser[] = [];

  const baseUrl = new URL("/search/users", GITHUB_API_URL);

  // Generate requests with URL length less than too much
  while (names.length) {
    const url = new URL(baseUrl);
    let q = "";

    while (url.href.length < 7000) {
      const name = names.shift();
      if (!name) break;

      if (q) q += " ";
      q += `user:${name}`;
      url.searchParams.set("q", q);
    }

    const result = await _fetchGithubUsers(url);
    users.push(...result);
  }

  return users;
}

async function _fetchGithubUsers(url: URL): Promise<GithubUser[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not fetch GitHub users: " + response.status + ": " + response.statusText);
  }

  const result = await response.json();

  if (result.incomplete_results) console.warn("GITHUB FETCH USERS INCOMPLETE RESULTS!!");

  return result.items;
}

export async function fetchGithubContributions(author: string): Promise<GithubRepository[]> {
  const url = new URL(`/search/commits`, GITHUB_API_URL);
  url.searchParams.set("q", `org:${GITHUB_ORG} author:${author}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not fetch GitHub contributions: " + response.status + ": " + response.statusText);
  }

  const result = await response.json();

  if (result.incomplete_results) console.warn("GITHUB FETCH CONTRIBUTIONS INCOMPLETE RESULTS!!");

  const repositories: Record<string, GithubRepository> = {};
  for (const commit of result.items) {
    repositories[commit.repository.id] = commit.repository;
  }

  return Object.values(repositories);
}
