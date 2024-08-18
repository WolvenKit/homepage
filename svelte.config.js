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
      images: {
        // Should match $lib/components/elements/Image.svelte
        sizes: [128, 256, 720, 1280, 1920, 3840],
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 3600,
        domains: ["cdn.discordapp.com"],
      },
    }),
    prerender: {
      origin: "https://" + (process.env.VERCEL_PROJECT_PRODUCTION_URL || "sveltekit-prerender"),
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
