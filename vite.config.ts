import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { uneval } from "devalue";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import YAML from "yaml";

const YAML_REGEX = /\.ya?ml$/;

export default defineConfig({
  plugins: [
    glsl(),
    tailwindcss(),
    ViteImageOptimizer({
      webp: { minSize: true, mixed: true },
      includePublic: true,
      // exclude animated
      test: /^((?!\b(borpa_spin|cube|cat_fine)\.).)+\.(png|webp|jpe?g|avif)$/,
    }),
    sveltekit(),
    {
      name: "yaml",
      enforce: "pre",
      transform(src, id) {
        if (!YAML_REGEX.exec(id)) return;

        return { code: "export default " + uneval(YAML.parse(src)) + ";" };
      },
    },
  ],
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: [".."],
    },
  },
});
