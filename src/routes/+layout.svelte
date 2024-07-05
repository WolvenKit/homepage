<script lang="ts">
  import "@fontsource/rajdhani/400.css";
  import "@fontsource/rajdhani/700.css";
  import { config } from "@fortawesome/fontawesome-svg-core";

  import "../app.css";
  import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
  config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

  import sammy from "$assets/sammy.png";
</script>

<header class="sticky top-0 z-40 flex w-full justify-between px-8 py-2">
  <a href="/" class="flex flex-wrap items-center gap-8">
    <img src={sammy} width="128" height="128" alt="" class="h-24 w-auto" />

    <h1 class="text-4xl font-bold uppercase leading-none text-red md:text-5xl lg:text-6xl">Red Modding</h1>
  </a>
</header>

<slot />
