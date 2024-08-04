import { error } from "@sveltejs/kit";
import { fetchMembers } from "$lib/server/members";
import { fetchGithubContributions } from "$lib/server/services/github";
import { fetchNexusProfile } from "$lib/server/services/nexus";
import type { PageServerLoad } from "./$types";

export const prerender = "auto";

export const load = (async ({ params, parent }) => {
  const { memberMap } = await parent();
  const member = memberMap[params.member];

  if (!member) error(404, "Member not found");

  const [contributions, nexus] = await Promise.all([
    (member.CustomData?.github && fetchGithubContributions(member.CustomData.github)) || undefined,
    (member.CustomData?.nexusmods && fetchNexusProfile(member.CustomData.nexusmods)) || undefined,
  ]);

  return { member, contributions, nexus };
}) satisfies PageServerLoad;

export const entries = async () => {
  const members = await fetchMembers();

  return Object.keys(members).map((member) => ({ member }));
};
