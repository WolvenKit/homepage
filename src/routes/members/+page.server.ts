import type { PageServerLoad } from "./$types";

export const load = (async ({ parent }) => {
  const data = await parent();

  return { teamMembers: data.teamMembers };
}) satisfies PageServerLoad;
