import { getCachedMembers } from "$lib/server/members";
import { wrapCatch } from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const memberMap = await getCachedMembers()
    .then((v) => v.memberMap)
    .catch(wrapCatch({ description: "Fetching member data failed. Please try again later." }));

  return { memberMap };
}) satisfies PageServerLoad;
