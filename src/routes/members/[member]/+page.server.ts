import { error } from "@sveltejs/kit";
import { fetchMembers } from "$lib/server/members";
import type { PageServerLoad } from "./$types";

export const prerender = "auto";

export const load = (async ({ params }) => {
  const members = await fetchMembers();
  const member = members[params.member];

  if (!member) error(404, "Member not found");

  return { member };
}) satisfies PageServerLoad;

// export const entries = async () => {
//   const members = await fetchMembers();

//   return Object.keys(members).map((member) => ({ member }));
// };
