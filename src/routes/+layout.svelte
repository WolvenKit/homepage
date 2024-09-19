<script lang="ts">
  import "@fontsource/rajdhani/400.css";
  import "@fontsource/rajdhani/600.css";
  import "@fontsource/rajdhani/700.css";
  import "@fontsource/rajdhani/";
  import "@fontsource/metamorphous/400.css";

  import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
  import { config } from "@fortawesome/fontawesome-svg-core";
  config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

  import "../app.css";

  import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
  import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";
  import { browser } from "$app/environment";
  import { beforeNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import catLove from "$assets/cat_love.webp";
  import Button from "$components/elements/Button.svelte";
  import Image from "$components/elements/Image.svelte";
  import IdleBlackwall from "$components/parts/BlackwallScreensaver";
  import CursorTrail from "$components/parts/CursorTrail.svelte";
  import DotsSidesBackground from "$components/parts/DotsSidesBackground.svelte";
  import Sammy from "$components/parts/Sammy.svelte";
  import Divider from "$lib/components/elements/Divider.svelte";
  import { site } from "$lib/content/site";

  export let data;

  let scrollY = 2;
  let navOpen = false;
  let navClosed = true; // after transition

  $: if (navOpen) navClosed = false;

  $: isOnTop = scrollY < 2;

  $: isLanding = $page.route?.id == "/";

  beforeNavigate(() => {
    navOpen = false;
  });

  function onKeyDown(ev: KeyboardEvent) {
    if (navOpen && ev.key == "Escape") navOpen = false;
  }
</script>

<svelte:window bind:scrollY on:keydown={onKeyDown} />

<IdleBlackwall />

<header
  class={twMerge(
    "sticky top-0 z-40 flex h-16 w-full items-center gap-8 bg-zinc-900 pr-4 shadow-xl transition duration-500 xl:px-[10svw]",
    isOnTop && "script:bg-transparent script:shadow-none",
  )}
>
  <Sammy {isOnTop} class="max-md:h-16" />

  <a
    href="/"
    class={twMerge(
      "text-2xl font-bold uppercase text-red transition-all duration-500 sm:text-4xl",
      isOnTop && "script:lg:translate-y-1/2 script:lg:text-6xl",
    )}
  >
    {site.name}
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
      {#each Object.entries(site.menu) as [label, link], i (i)}
        <li><Button class="text-xl" href={link}>{label}</Button></li>
      {/each}
    </ul>
  </nav>
</header>

<DotsSidesBackground landing={isLanding} class={isLanding ? "" : "fixed"} />

<CursorTrail>
  <main class="flex flex-grow flex-col">
    <slot />
  </main>

  <footer class="relative z-10 flex w-full flex-wrap items-start justify-center gap-8 bg-black p-8 md:justify-between">
    <div class="flex flex-wrap items-center justify-center gap-4 md:w-1/4">
      <Sammy isOnTop />

      <div class="flex flex-col items-start max-md:items-center max-md:text-center">
        <a href="/" class="text-4xl font-bold uppercase text-red transition-all duration-500">{site.name}</a>
        <Divider class="my-1 inline-flex px-1 " />

        <div class="text-sm text-gray-600">
          <div>&copy; {new Date().getFullYear()} Red Modding Tools. All Rights Reserved.</div>
          <a href="/privacy" class="underline hover:text-zinc-400">Privacy Policy</a> |
          <a href="/terms" class="underline hover:text-zinc-400">Terms and Conditions</a>
        </div>
      </div>
    </div>

    <div class="text-center">
      <noscript>
        <div class="text-red">JavaScript is not required but it is recommended for this website to work it's best!</div>
      </noscript>

      <div class="leading-none">
        Website made with
        <Image src={catLove} alt="love" title="love" width={22} height={22} class="inline" />
        by <Button inline hideExternal href="https://zhincore.eu/">@Zhincore</Button>.
        <div class="text-zinc-400">Ping him on Discord about feedback or complaints.</div>
        <Button href={site.source}>Source code</Button>

        <div class="block text-zinc-500">
          <span class="text-sm">Website last updated on</span>
          <date>{data.buildDate.toLocaleString()}</date>
        </div>
      </div>
    </div>

    <div class="text-right md:w-1/4">
      <Button class="text-xl" href={site.menu.wiki}>Wiki</Button>
    </div>
  </footer>
</CursorTrail>
