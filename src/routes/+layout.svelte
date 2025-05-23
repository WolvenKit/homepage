<script lang="ts">
  import "@fontsource/rajdhani/400.css";
  import "@fontsource/rajdhani/600.css";
  import "@fontsource/rajdhani/700.css";
  import "@fontsource/rajdhani";
  import "@fontsource/metamorphous/400.css";

  import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
  import { config } from "@fortawesome/fontawesome-svg-core";
  config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

  import "../app.css";

  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
  import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
  import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";
  import { browser } from "$app/environment";
  import { beforeNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import catLove from "$assets/cat_love.webp";
  import Button from "$components/elements/Button.svelte";
  import Divider from "$components/elements/Divider.svelte";
  import LazyImage from "$components/elements/LazyImage.svelte";
  import IdleBlackwall from "$components/parts/BlackwallScreensaver";
  import CursorTrail from "$components/parts/CursorTrail.svelte";
  import DotsSidesBackground from "$components/parts/DotsSidesBackground.svelte";
  import Sammy from "$components/parts/Sammy.svelte";
  import { site } from "$lib/content/site";

  let { data, children } = $props();

  let scrollY = $state(2);
  let navOpen = $state(false);
  let navClosed = $state(true); // after transition

  $effect.pre(() => {
    if (navOpen) navClosed = false;
  });

  let isOnTop = $derived(scrollY < 2);

  let isLanding = $derived(page.route?.id == "/");

  beforeNavigate(() => {
    navOpen = false;
  });

  function onKeyDown(ev: KeyboardEvent) {
    if (navOpen && ev.key == "Escape") navOpen = false;
  }
</script>

<svelte:window bind:scrollY onkeydown={onKeyDown} />

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
      "text-red text-2xl font-bold uppercase transition-all duration-500 sm:text-4xl",
      isOnTop && "lg:script:translate-y-1/2 lg:script:text-6xl",
    )}
  >
    {site.name}
  </a>

  <nav id="mainNav" aria-label="Main navigation" class="group ml-auto">
    <button class="group text-cyan lg:hidden" aria-expanded={navOpen} onclick={() => (navOpen = !navOpen)}>
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
      ontransitionend={() => (navClosed = !navOpen)}
      class={twMerge(
        "flex items-end justify-center gap-4 max-lg:flex-col",
        "top-full right-0 origin-top transition max-lg:absolute max-lg:w-full max-lg:scale-y-0 max-lg:bg-zinc-950 max-lg:p-4 max-lg:shadow-xl",
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
  <main class="flex grow flex-col">
    {@render children?.()}
  </main>

  <footer class="relative z-10 flex w-full flex-wrap items-start justify-center gap-8 bg-black p-8 md:justify-between">
    <div class="flex flex-wrap items-center justify-center gap-4 md:w-1/4">
      <Sammy isOnTop />

      <div class="flex flex-col items-start max-md:items-center max-md:text-center">
        <a href="/" class="text-red text-4xl font-bold uppercase transition-all duration-500">{site.name}</a>
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
        <LazyImage src={catLove} alt="love" title="love" width={22} height={22} class="inline" />
        by <Button inline hideExternal href="https://zhincore.eu/">@Zhincore</Button>.
        <div class="text-zinc-400">
          Ping him on <a href={site.socials.Discord} class="text-cyan hover-focus:underline">the Discord</a> about feedback
          or complaints.
        </div>
        <Button href={site.source}>
          <FontAwesomeIcon icon={faGithub} />
          Source code
        </Button>

        {#if data.buildDate}
          <div class="block text-zinc-500">
            <span class="text-sm">Website last updated on</span>
            <date>{data.buildDate.toLocaleString()}</date>
          </div>
        {/if}
      </div>
    </div>

    <div class="text-right md:w-1/4">
      <Button class="text-xl" href={site.menu.wiki}>Wiki</Button>
    </div>
  </footer>
</CursorTrail>
