<script lang="ts">
  import "@fontsource/rajdhani/400.css";
  import "@fontsource/rajdhani/700.css";
  import { config } from "@fortawesome/fontawesome-svg-core";

  import "../app.css";
  import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
  config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

  import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
  import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";
  import { browser } from "$app/environment";
  import { beforeNavigate } from "$app/navigation";
  import sammy from "$assets/sammy.png";
  import Button from "$lib/elements/Button.svelte";

  let scrollY = 0;
  let navOpen = false;
  let navClosed = true; // after transition

  $: if (navOpen) navClosed = false;

  $: isOnTop = scrollY < 2;

  beforeNavigate(() => {
    navOpen = false;
  });

  function onKeyDown(ev: KeyboardEvent) {
    if (navOpen && ev.key == "Escape") navOpen = false;
  }
</script>

<svelte:window bind:scrollY on:keydown={onKeyDown} />

<header
  class={twMerge(
    "sticky top-0 z-40 flex h-16 w-full items-center gap-8 bg-zinc-900 pr-4 shadow-xl transition duration-500 xl:px-[10svw]",
    isOnTop && "script:bg-transparent script:shadow-none",
  )}
>
  <a
    href="/"
    class={twMerge(
      "relative z-10 mt-auto flex-shrink-0 rounded-full bg-zinc-900 p-4 shadow-xl transition duration-500",
      isOnTop && "script:bg-transparent script:shadow-none",
    )}
  >
    <img src={sammy} width="128" height="128" alt="" class="h-24 w-auto" />
  </a>

  <a
    href="/"
    class={twMerge(
      "text-2xl font-bold uppercase text-red transition-all duration-500 sm:text-4xl",
      isOnTop && "script:lg:translate-y-1/2 script:lg:text-6xl",
    )}
  >
    Red Modding
  </a>

  <nav id="mainNav" aria-label="Main navigation" class="group ml-auto">
    <button class="group text-cyan lg:hidden" aria-expanded={navOpen} on:click={() => (navOpen = !navOpen)}>
      <FontAwesomeIcon
        fixedWidth
        icon={faClose}
        size="2x"
        class="absolute opacity-0 transition group-aria-expanded:opacity-100"
      />
      <FontAwesomeIcon fixedWidth icon={faBars} size="2x" class="transition group-aria-expanded:opacity-0" />
      <span class="sr-only">Menu</span>
    </button>

    <ul
      on:transitionend={() => (navClosed = !navOpen)}
      class={twMerge(
        "flex items-end justify-center gap-4 max-lg:flex-col",
        "right-0 top-full origin-top transition max-lg:absolute max-lg:w-full max-lg:scale-y-0 max-lg:bg-zinc-950 max-lg:p-4 max-lg:shadow-xl",
        !browser && "max-lg:group-focus-within:scale-y-100",
        navOpen && "max-lg:scale-y-100",
        navClosed && browser && "max-lg:invisible",
      )}
    >
      <li><Button class="text-xl" href="https://wiki.redmodding.org">Wiki</Button></li>
      <li><Button class="text-xl" href="/projects">Projects</Button></li>
      <li><Button class="text-xl" href="/members">Members</Button></li>
      <li><Button class="text-xl" href="/about">About us</Button></li>
    </ul>
  </nav>
</header>

<main class="flex-grow">
  <slot />
</main>

<footer class="mt-8 flex w-full flex-wrap items-start justify-center p-8">
  <a href="https://wiki.redmodding.org/" class="cyber-text text-3xl">Link Harder</a>
  TODO: Footer

  <noscript>JavaScript is not required but it is recommended for this website to work it's best!</noscript>
</footer>
