import { error } from "@sveltejs/kit";
import { githubToProject } from "$lib/content/projects";
import type { GithubDataItem } from "$lib/server/lizzy";
import { getCachedMembers } from "$lib/server/members";
import { wrapCatch } from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  return await getCachedMembers()
    .then(async ({ memberMap }) => {
      const member = memberMap[params.member];

      if (!member) error(404, "Member not found");

      const contributions: Record<string, GithubDataItem[]> = {};

      for (const repo of member.GithubData ?? []) {
        const project = githubToProject[repo.Repository];
        if (!project) continue;

        if (!contributions[project]) contributions[project] = [];
        contributions[project].push(repo);
      }

      return { member, contributions };
    })
    .catch(wrapCatch({ description: "Fetching member data failed. Please try again later." }));
}) satisfies PageServerLoad;

export const entries = async () => {
  const { memberMap } = await getCachedMembers();

  return Object.keys(memberMap).map((member) => ({ member }));
};
