<script lang="ts">
  import "@fontsource/rajdhani/400.css";
  import "@fontsource/rajdhani/700.css";
  import { config } from "@fortawesome/fontawesome-svg-core";

  import "../app.css";
  import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
  config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

  import { twMerge } from "tailwind-merge";
  import sammy from "$assets/sammy.png";
  import Button from "$lib/elements/Button.svelte";

  let scrollY = 0;
</script>

<svelte:window bind:scrollY />

<header
  class={twMerge(
    "sticky top-0 z-40 flex h-16 w-full items-center gap-8 bg-zinc-900 px-[10svw] transition duration-500",
    scrollY > 1 && "shadow-xl",
  )}
>
  <a href="/" class="relative mt-auto flex flex-wrap items-center gap-8">
    <span
      class={twMerge("rounded-full p-4 transition duration-500", scrollY > 1 && "bg-zinc-900 shadow-xl backdrop-blur")}
    >
      <img src={sammy} width="128" height="128" alt="" class="h-24 w-auto" />
    </span>
  </a>

  <h1
    class={twMerge(
      "text-4xl font-bold uppercase text-red transition-all duration-500",
      scrollY <= 1 && "translate-y-1/2 text-6xl",
    )}
  >
    Red Modding
  </h1>

  <nav class="ml-auto">
    <ul class="flex gap-4">
      <li><Button class="text-xl" href="https://wiki.redmodding.org">Wiki</Button></li>
      <li><Button class="text-xl" href="/projects">Projects</Button></li>
      <li><Button class="text-xl" href="/about">About us</Button></li>
    </ul>
  </nav>
</header>

<main>
  <slot />
</main>

<footer class="mt-8 flex w-full flex-wrap items-start justify-center p-8">
  <a href="https://wiki.redmodding.org/" class="cyber-text text-3xl">Link Harder </a>
</footer>
