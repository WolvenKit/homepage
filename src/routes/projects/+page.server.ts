import { getCachedMembers } from "$lib/server/members";
import { wrapCatch } from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load = (async ({ isDataRequest }) => {
  const promise = getCachedMembers()
    .then((v) => v.memberMap)
    .catch(wrapCatch({ description: "Fetching member data failed. Please try again later." }));

  return { memberMap: isDataRequest ? promise : await promise };
}) satisfies PageServerLoad;
