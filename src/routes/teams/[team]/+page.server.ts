import { getCachedMembers } from "$lib/server/members";
import { wrapCatch } from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const memberMap = await getCachedMembers()
    .then((v) => v.memberMap)
    .catch(wrapCatch({ description: "Fetching member data failed. Please try again later." }));

  const members = Object.values(memberMap)
    .filter((m) => m.Teams.has(params.team))
    .sort((a, b) => a.Username.localeCompare(b.Username));

  return { members };
}) satisfies PageServerLoad;

export const entries = async () => {
  const teamMembers = await getCachedMembers().then((v) => v.teamMembers);

  return Object.keys(teamMembers).map((team) => ({ team }));
};
