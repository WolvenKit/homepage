import { fetchMembers } from "$lib/server/members";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  return { teamMembers: await fetchMembers() };
}) satisfies PageServerLoad;
