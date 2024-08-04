import { fetchMembers } from "$lib/server/members";
import type { PageServerLoad } from "./$types";

export const load = (async ({}) => {
  const members = await fetchMembers();

  return { member: await fetchMembers() };
}) satisfies PageServerLoad;
