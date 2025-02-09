import defaultConfig from "tailwindcss/defaultConfig";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app.html", "./src/**/*.{svelte,ts}"],

  theme: {
    extend: {
      colors: {
        yellow: { DEFAULT: "#f3e600", dark: "#d3c600" },
        cyan: { light: "#75ffff", DEFAULT: "#04daf6", dark: "#008b9d", darker: "#00464f" },
        red: { DEFAULT: "#ff003c", dark: "#910022", darker: "#40000f", darkest: "#090002" },
        witcher: { gold: "#e1a735", silver: "#718381" },
      },
      fontFamily: {
        sans: ["Rajdhani", ...defaultConfig.theme.fontFamily.sans],
        witcher: ["Metamorphous", ...defaultConfig.theme.fontFamily.serif],
      },
      listStyleType: {
        dash: "'\\2013 '",
      },
      boxShadow: {
        "xl-front": "2px 3px 16px 8px rgb(0 0 0 / 0.9)",
      },
      keyframes: {
        blink: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
      },
      transitionDuration: {
        DEFAULT: "250ms",
      },
      dropShadow: {
        px: "1px 1px 0 black",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant, matchUtilities, matchVariant, theme }) {
      addVariant("hover-focus", ["&:hover", "&:focus", "&:focus-within"]);
      addVariant("group-hover-focus", [
        ":merge(.group):hover &",
        ":merge(.group):focus &",
        ":merge(.group):focus-within &",
      ]);
      addVariant("peer-hover-focus", [
        ":merge(.peer):hover ~ &",
        ":merge(.peer):focus ~ &",
        ":merge(.peer):focus-within ~ &",
      ]);

      addVariant("pseudo", ["&::before", "&::after"]);

      addVariant("noscript", ["body.noscript &"]);
      addVariant("script", ["body:not(.noscript) &"]);

      matchVariant(
        "max-v",
        (value) => {
          return `@media (max-height: ${value})`;
        },
        { values: theme("screens") },
      );
      matchVariant(
        "v",
        (value) => {
          return `@media (min-height: ${value})`;
        },
        { values: theme("screens") },
      );

      matchUtilities({
        clip: (value) => ({
          "clip-path": value,
        }),
      });
    }),
  ],
};
