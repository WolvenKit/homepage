import type { LayoutServerLoad } from "./$types";

export const load = (async () => {
  return {
    rand: Math.random(),
  };
}) satisfies LayoutServerLoad;
