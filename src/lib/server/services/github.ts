import { GITHUB_TOKEN } from "$env/static/private";
import { githubToProject, projects } from "$lib/content/projects";
import { gql, sleep } from "$lib/utils";

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  "X-GitHub-Api-Version": "2022-11-28",
};

export interface Contributions {
  projectId: string;
  repositories: Record<
    string,
    {
      commits: number;
      issues: number;
    }
  >;
}

//
// Base utility
//

async function fetchGithub<T>(path: string, init?: RequestInit, attempt = 1): Promise<T> {
  const response = await fetch(new URL(path, GITHUB_API_URL), {
    ...init,
    headers: { ...GITHUB_HEADERS, ...init?.headers },
  });

  const retry = async (delaySeconds: number) => {
    if (attempt >= 3) {
      throw new Error("Could not fetch GitHub after 3 retries: " + response.status + ": " + response.statusText);
    }
    await sleep(delaySeconds * 1000);
    return fetchGithub<T>(path, init, attempt + 1);
  };

  if (!response.ok) {
    // Check rate limit
    const retryAfter = response.headers.get("retry-after");
    if (retryAfter) {
      // Wait for it, I guess?
      return retry(parseFloat(retryAfter));
    }

    const rateLimit = response.headers.get("x-ratelimit-remaining");
    if (rateLimit === "0") {
      const rateLimitReset = response.headers.get("x-ratelimit-reset");
      if (rateLimitReset) {
        return retry(parseFloat(rateLimitReset) - Date.now());
      }
    }

    throw new Error("Could not fetch GitHub: " + response.status + ": " + response.statusText);
  }

  return response.json();
}

//
// Level 1 utility
//

async function fetchGithubUserId(login: string) {
  const result = await fetchGithub<{ node_id: string }>("/users/" + login);
  return result.node_id;
}

async function fetchGithubGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  return fetchGithub("/graphql", {
    method: "POST",
    headers: GITHUB_HEADERS,
    body: JSON.stringify({ query, variables }),
  });
}

//
// Functions
//

let repoIds: string[] | null = null;

async function fetchRepoIdsCached() {
  if (repoIds) return repoIds;

  const params = new URLSearchParams({
    q: Object.values(projects)
      .flatMap((project) => {
        if (!project.githubs) return;
        const githubs = Array.isArray(project.githubs) ? project.githubs : [project.githubs];
        return githubs.map((github) => (github.includes("/") ? "repo:" + github : "org:" + github));
      })
      .filter((v) => v)
      .join(" "),
  });

  const result = await fetchGithub<{ items: { node_id: string }[] }>("/search/repositories?" + params);
  repoIds = result.items.map((repo) => repo.node_id);
  return repoIds;
}

export async function fetchGithubContributions(
  author: string,
  authorId?: string,
): Promise<Record<string, Contributions>> {
  const [repos, _authorId] = await Promise.all([fetchRepoIdsCached(), authorId ?? fetchGithubUserId(author)]);

  authorId = _authorId;

  const result = await fetchGithubGraphQL<ContributionGQLResult>(
    gql`
      query ($repos: [ID!]!, $author: String!, $authorId: ID!) {
        nodes(ids: $repos) {
          ... on Repository {
            nameWithOwner
            issues(filterBy: { createdBy: $author }) {
              totalCount
            }
            defaultBranchRef {
              target {
                ... on Commit {
                  history(author: { id: $authorId }) {
                    totalCount
                  }
                }
              }
            }
          }
        }
      }
    `,
    { repos, author, authorId },
  );

  return processContributions(result.data.nodes);
}

function processContributions(repositories: GQLRepository[]) {
  const contributions: Record<string, Contributions> = {};

  for (const repository of repositories) {
    const fullName = repository.nameWithOwner;
    const owner = fullName.split("/", 1)[0];

    const projectId = githubToProject[fullName] ?? githubToProject[owner];
    if (!projectId) continue;

    const commits = repository.defaultBranchRef.target.history.totalCount;
    const issues = repository.issues.totalCount;

    // NOTE: Could add && !issues to show project where member only created issues, but I didn't want that
    if (!commits) continue;

    // Create project contribution
    let contribution = contributions[projectId];
    if (!contribution) {
      contribution = { projectId, repositories: {} };
      contributions[projectId] = contribution;
    }

    // Create repository
    contribution.repositories[fullName] = { commits, issues };
  }

  return contributions;
}

// function mergeContributions(...results: Record<string, Contributions>[]) {
//   const contributions = results[0];

//   for (const contribution of results.slice(1)) {
//     for (const [projectId, contrib] of Object.entries(contribution)) {
//       if (!contributions[projectId]) {
//         contributions[projectId] = contrib;
//       } else {
//         mergeRepoCommits(contributions[projectId], contrib);
//       }
//     }
//   }

//   return contributions;
// }

// function mergeRepoCommits(a: Contributions, b: Contributions) {
//   const repoCommits = a.repositories;
//   for (const [repo, contribs] of Object.entries(b.repositories)) {
//     if (!repoCommits[repo]) repoCommits[repo] = contribs;
//     else {
//       repoCommits[repo].commits += contribs.commits;
//       repoCommits[repo].issues += contribs.issues;
//     }
//   }
// }

interface ContributionGQLResult {
  data: {
    nodes: GQLRepository[];
  };
}

interface GQLRepository {
  nameWithOwner: string;
  issues: { totalCount: number };
  defaultBranchRef: { target: { history: { totalCount: number } } };
}
