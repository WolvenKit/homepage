import defaultConfig from "tailwindcss/defaultConfig";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app.html", "./src/**/*.{svelte,ts}"],
  theme: {
    extend: {
      colors: {
        yellow: { DEFAULT: "#f3e600", dark: "#d3c600" },
        cyan: { light: "#75ffff", DEFAULT: "#04daf6" },
        red: { DEFAULT: "#ff003c", dark: "#910022", darker: "#40000f", darkest: "#090002" },
      },
      fontFamily: {
        sans: ["Rajdhani", ...defaultConfig.theme.fontFamily.sans],
      },
      listStyleType: {
        dash: "'\\2013 '",
      },
      fill: {
        "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
      },
      animation: {
        blink: "blink 0.5s linear infinite alternate",
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
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
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
    }),
  ],
};
