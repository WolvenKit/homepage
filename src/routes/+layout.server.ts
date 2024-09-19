import type { LayoutServerLoad } from "./$types";

export const prerender = true;

export const load = (async () => {
  return {
    rand: Math.random(),
    buildDate: new Date(),
  };
}) satisfies LayoutServerLoad;
