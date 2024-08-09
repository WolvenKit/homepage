import { error } from "@sveltejs/kit";
import { getCachedMembers, type TeamMember } from "$lib/server/members";
import { fetchGithubContributions, type GithubRepository } from "$lib/server/services/github";
import { fetchNexusProfile, type NexusProfile } from "$lib/server/services/nexus";
import type { PageServerLoad } from "./$types";

export const prerender = "auto";

export const load = (async ({ params, isDataRequest }) => {
  const promise = getCachedMembers().then(async ({ memberMap }) => {
    const member = memberMap[params.member];

    if (!member) error(404, "Member not found");

    const [contributions, nexus] = await Promise.all([
      (member.CustomData?.github && fetchGithubContributions(member.CustomData.github)) || undefined,
      (member.CustomData?.nexusmods && fetchNexusProfile(member.CustomData.nexusmods)) || undefined,
    ]);

    return { member, contributions, nexus };
  });

  return isDataRequest
    ? (promise.catch(console.error) as Promise<{
        member: TeamMember;
        contributions: GithubRepository[] | undefined;
        nexus: NexusProfile | undefined;
      }>)
    : await promise;
}) satisfies PageServerLoad;

export const entries = async () => {
  const { memberMap } = await getCachedMembers();

  return Object.keys(memberMap).map((member) => ({ member }));
};
