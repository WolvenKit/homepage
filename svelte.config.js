import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      fallback: "404.html",
    }),
    prerender: {
      origin: process.env.ORIGIN,
    },
    alias: {
      $lib: "./src/lib",
      $assets: "./src/assets",
      $components: "./src/lib/components",
      $content: "./content",
    },
  },
};

export default config;
