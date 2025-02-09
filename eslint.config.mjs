import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import eslintPluginSvelte from "eslint-plugin-svelte";
import globals from "globals";
import * as svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";

/* eslint-disable import/no-named-as-default-member */

export default tseslint.config(
  {
    ignores: ["node_modules", ".svelte-kit", ".wrangler", "build"],
  },
  js.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  ...eslintPluginSvelte.configs["flat/recommended"],
  ...eslintPluginSvelte.configs["flat/prettier"],
  {
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      "import/internal-regex": "^(~|\\$)",
      "import/external-regex": "^\\$app",
      "import/resolver": "typescript",
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
        project: "./tsconfig.json",
        extraFileExtensions: [".svelte"],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "import/no-duplicates": "off", // breaks "svelte/transitions"
      "import/no-unresolved": "off",
      "import/no-dynamic-require": "warn",
      "import/no-nodejs-modules": "warn",
      "import/no-useless-path-segments": "warn",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling"],
          alphabetize: {
            order: "asc",
          },
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
);
