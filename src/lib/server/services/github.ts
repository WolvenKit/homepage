import { GITHUB_TOKEN } from "$env/static/private";
import { githubToProject, projects } from "$lib/content/projects";

const GITHUB_API_URL = "https://api.github.com";
const NEXT_PATTERN = /(?<=<)(\S*)(?=>; rel="Next")/i;

export interface Contributions {
  projectId: string;
  repositoryCommits: Record<string, number>;
}

const PROJECTS_FILTER = Object.values(projects)
  .flatMap((project) => {
    if (!project.githubs) return;
    const githubs = Array.isArray(project.githubs) ? project.githubs : [project.githubs];
    return githubs.map((github) => (github.includes("/") ? "repo:" + github : "org:" + github));
  })
  .filter((v) => v)
  .join(" ");

export async function fetchGithubContributions(author: string) {
  const url = new URL(`/search/commits`, GITHUB_API_URL);
  url.searchParams.set("q", `${PROJECTS_FILTER} author:${author}`);

  const results = await _fetchContributions(url);

  return mergeContributions(results);
}

function mergeContributions(results: Record<string, Contributions>[]) {
  const contributions = results[0];

  for (const contribution of results.slice(1)) {
    for (const [projectId, contrib] of Object.entries(contribution)) {
      if (!contributions[projectId]) {
        contributions[projectId] = contrib;
      } else {
        mergeRepoCommits(contributions[projectId], contrib);
      }
    }
  }

  return contributions;
}

function mergeRepoCommits(a: Contributions, b: Contributions) {
  const repoCommits = a.repositoryCommits;
  for (const [repo, commits] of Object.entries(b.repositoryCommits)) {
    if (!repoCommits[repo]) repoCommits[repo] = commits;
    else repoCommits[repo] += commits;
  }
}

async function _fetchContributions(url: URL | string): Promise<Record<string, Contributions>[]> {
  const response = await fetch(url, {
    headers: {
      ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!response.ok) {
    throw new Error("Could not fetch GitHub contributions: " + response.status + ": " + response.statusText);
  }

  const result = await response.json();

  const linkHeader = response.headers.get("link");
  let nextPagePromise: ReturnType<typeof _fetchContributions> | undefined = undefined;

  if (linkHeader?.includes(`rel="next"`)) {
    NEXT_PATTERN.lastIndex = 0;
    const nextUrl = NEXT_PATTERN.exec(linkHeader)?.[0];
    if (nextUrl) {
      nextPagePromise = _fetchContributions(nextUrl);
    }
  }

  const contributions: Record<string, Contributions> = {};
  for (const commit of result.items) {
    const repo = commit.repository;
    const projectId = githubToProject[repo.full_name] ?? githubToProject[repo.owner.login];
    if (!projectId) continue;

    // Create project contribution
    let contribution = contributions[projectId];
    if (!contribution) {
      contribution = { projectId, repositoryCommits: {} };
      contributions[projectId] = contribution;
    }

    // Create repository commits
    if (!contribution.repositoryCommits[repo.full_name]) {
      contribution.repositoryCommits[repo.full_name] = 0;
    }

    contribution.repositoryCommits[repo.full_name]++;
  }

  if (nextPagePromise) return [contributions, ...(await nextPagePromise)];
  return [contributions];
}
