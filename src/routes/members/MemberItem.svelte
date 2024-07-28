<script lang="ts" context="module">
  import type { Team } from "$lib/parts/TeamBadge.svelte";

  export interface Member {
    name: string;
    bio: string;
    image: string;
    teams: Team[];
    theme?: Theme;
  }
</script>

<script lang="ts">
  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
  import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
  import { twMerge } from "tailwind-merge";
  import Button from "$lib/elements/Button.svelte";
  import Image from "$lib/elements/Image.svelte";
  import TeamBadge from "$lib/parts/TeamBadge.svelte";
  import ThemeFrameBig from "$lib/theme/ThemeFrameBig.svelte";
  import ThemeFrameSmall from "$lib/theme/ThemeFrameSmall.svelte";
  import WitcherDivider from "$lib/theme/WitcherDivider.svelte";
  import { outlineToPath, THEME_CORNERS, type Theme } from "$lib/themes";
  import { tw, type CornerConfig } from "$lib/utils";

  export let member: Member;

  const THEMES = {
    Cyberpunk: {
      base: tw`bg-black`,
      header: tw`border-b-2 border-red`,
      name: tw`cyber-text`,
      image: tw`-my-0.5`,
      content: tw`text-red`,
      links: tw``,
      frame: tw``,
    },
    Witcher: {
      base: tw`bg-zinc-800`,
      header: tw`border-none bg-zinc-700 px-6`,
      name: tw`small-caps font-[Metamorphous] text-witcher-gold`,
      image: tw`-my-px drop-shadow-px`,
      content: tw``,
      links: tw`mr-1`,
      frame: tw`drop-shadow-px`,
    },
  } satisfies Record<Theme, Record<"base" | "header" | "name" | "image" | "content" | "links" | "frame", string>>;

  const CORNERS = {
    Cyberpunk: { tr: true, bl: true },
    Witcher: { tl: true, tr: true, br: true },
  } satisfies Record<Theme, CornerConfig>;

  // Align right side of the item with integers cuz of firefox rendering issues
  let container: HTMLElement;
  let clientWidth = 0;
  let compensateWidth = 0;
  $: if (container && clientWidth) {
    const rect = container.getBoundingClientRect();
    const width = rect.width + rect.x;
    compensateWidth = Math.ceil(width) - width - compensateWidth;
  }

  $: theme = member.theme && THEMES[member.theme];
  $: corners = member.theme && CORNERS[member.theme];
  $: clipPath = member.theme && outlineToPath(THEME_CORNERS[member.theme].outline, corners);
</script>

<li
  bind:this={container}
  bind:clientWidth
  class={twMerge("witcher-clip relative flex flex-col bg-zinc-800", theme?.base)}
  style:clip-path={clipPath}
  style:padding-right="{compensateWidth}px"
>
  <h3 class={twMerge("relative flex flex-wrap items-center justify-between gap-x-4 p-2", theme?.header)}>
    <span class={twMerge("text-2xl leading-none", theme?.name)}>{member.name}</span>

    {#if member.teams.length}
      <ul class="flex flex-wrap gap-px">
        {#each member.teams as team (team)}
          <li><TeamBadge {team} /></li>
        {/each}
      </ul>
    {/if}

    {#if member.theme == "Witcher"}
      <div class="absolute -left-px bottom-0 right-0 flex h-0 text-zinc-400">
        <span class="-mt-0.5 inline-block h-0 w-[130px] translate-x-px border-b-2 border-current" />
        <WitcherDivider withoutCorners class="flex-grow rotate-180 text-inherit drop-shadow-px" />
      </div>
    {/if}
  </h3>

  <div class="flex">
    <div class={twMerge("relative", theme?.image)}>
      <Image src={member.image} width={96} height={96} class="size-32 object-cover" />

      {#if member.theme}
        <ThemeFrameSmall theme={member.theme} />
      {/if}
    </div>

    <div class={twMerge("relative flex h-full flex-shrink-0 flex-grow flex-col p-4", theme?.content)}>
      <p class={twMerge("leading-tight ")}>{member.bio}</p>

      <ul class={twMerge("-mb-4 -mr-3 ml-auto mt-auto flex gap-1", theme?.links)}>
        <li>
          <Button iconOnly hideExternal icon={faGithub} label="GitHub" />
        </li>
        <li>
          <Button iconOnly hideExternal icon={faEnvelope} label="Email" />
        </li>
      </ul>
    </div>
  </div>

  {#if member.theme}
    <ThemeFrameBig theme={member.theme} {corners} class={theme?.frame} />
  {/if}
</li>

<style>
  .cyberborder::before,
  .cyberborder::after {
    content: "";
    position: absolute;
    background: black;
    border: 2px solid theme("colors.red.DEFAULT");
  }
  .cyberborder::after {
    width: 1.5rem;
    height: 1.5rem;
    right: -0.75rem;
    bottom: -0.75rem;
    transform: rotate(45deg);
  }
  .cyberborder::before {
    top: -0.5rem;
    left: -2px;
    width: 2.5rem;
    height: 1rem;
    transform: skewX(-45deg);
    border-right-width: 3px;
  }
</style>
