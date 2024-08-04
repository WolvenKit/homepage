import { fetchTeams } from "$lib/server/members";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  return { teamMembers: await fetchTeams() };
}) satisfies PageServerLoad;
