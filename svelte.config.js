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
        // Should match $components/elements/Image.svelte
        sizes: [32, 128, 256, 640, 720],
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 3600,
        domains: ["cdn.discordapp.com","staticdelivery.nexusmods.com"],
      },
    }),
    prerender: {
      origin: "https://" + (process.env.VERCEL_PROJECT_PRODUCTION_URL || "sveltekit-prerender"),

      handleHttpError: ({ path, message }) => {
        if (path === "/_vercel/image") return;

        // otherwise fail the build
        throw new Error(message);
      },
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
