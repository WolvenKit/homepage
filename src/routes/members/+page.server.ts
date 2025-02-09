import { getCachedMembers } from "$lib/server/members";
import { wrapCatch } from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const teamMembers = await getCachedMembers()
    .then((v) => v.teamMembers)
    .catch(wrapCatch({ description: "Fetching member data failed. Please try again later." }));

  return { teamMembers };
}) satisfies PageServerLoad;
