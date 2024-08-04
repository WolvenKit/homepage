import { fetchMembers } from "$lib/server/members";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  return { member: {} };
}) satisfies PageServerLoad;

export const entries = "auto";
