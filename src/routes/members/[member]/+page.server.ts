import { error } from "@sveltejs/kit";
import { getCachedMembers } from "$lib/server/members";
import { fetchGithubContributions } from "$lib/server/services/github";
import { fetchNexusProfile } from "$lib/server/services/nexus";
import { wrapCatch } from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, isDataRequest }) => {
  const promise = getCachedMembers()
    .then(async ({ memberMap }) => {
      const member = memberMap[params.member];

      if (!member) error(404, "Member not found");

      const [contributions, nexus] = await Promise.all([
        (member.CustomData?.github && fetchGithubContributions(member.CustomData.github)) || undefined,
        (member.CustomData?.nexusmods && fetchNexusProfile(member.CustomData.nexusmods)) || undefined,
      ]);

      return { member, contributions, nexus };
    })
    .catch(wrapCatch({ description: "Fetching member data failed. Please try again later." }));

  return isDataRequest ? promise : await promise;
}) satisfies PageServerLoad;

export const entries = async () => {
  const { memberMap } = await getCachedMembers();

  return Object.keys(memberMap).map((member) => ({ member }));
};
