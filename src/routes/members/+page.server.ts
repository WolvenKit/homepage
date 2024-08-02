import { fetchTeams, type TeamMember } from "$lib/server/lizzy";
import type { PageServerLoad } from "./$types";

let cache: Record<string, TeamMember[]> | null = null;

export const load = (async () => {
  if (!cache) cache = await fetchTeams();

  return { teamMembers: cache };
}) satisfies PageServerLoad;
