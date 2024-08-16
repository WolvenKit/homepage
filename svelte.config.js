import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      isr: { expiration: 60 * 60 * 24 },
      supportsResponseStreaming: true,
    }),
    prerender: {
      origin: process.env.VERCEL_PROJECT_PRODUCTION_URL,
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
