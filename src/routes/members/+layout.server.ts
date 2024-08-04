import { getCachedMembers } from "$lib/server/members";
import type { LayoutServerLoad } from "./$types";

export const load = (async () => {
  return await getCachedMembers();
}) satisfies LayoutServerLoad;
