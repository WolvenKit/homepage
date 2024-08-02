import { sveltekit } from "@sveltejs/kit/vite";
import { uneval } from "devalue";
import { defineConfig } from "vite";
import YAML from "yaml";

const YAML_REGEX = /\.ya?ml$/;

export default defineConfig({
  plugins: [
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
