import type { Teams } from "$lib/content/teams";
import { getCachedMembers } from "$lib/server/members";
import type { PageServerLoad } from "./$types";

export const load = (async ({ isDataRequest }) => {
  const promise = getCachedMembers().then((v) => v.teamMembers);

  return { teamMembers: isDataRequest ? (promise.catch(console.error) as unknown as Promise<Teams>) : await promise };
}) satisfies PageServerLoad;
