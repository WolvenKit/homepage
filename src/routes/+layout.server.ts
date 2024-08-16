import { VERCEL_GIT_COMMIT_SHA } from "$env/static/private";
import type { LayoutServerLoad } from "./$types";

export const load = (async () => {
  return {
    rand: Math.random(),
    commitSha: VERCEL_GIT_COMMIT_SHA,
  };
}) satisfies LayoutServerLoad;
