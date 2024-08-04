<script lang="ts">
  import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";
  import fuzz from "$assets/members/fuzzo.png";
  import Button from "$components/elements/Button.svelte";
  import Image from "$components/elements/Image.svelte";
  import ThemeFrameBig from "$components/theme/ThemeFrameBig.svelte";
  import ThemeFrameSmall from "$components/theme/ThemeFrameSmall.svelte";
  import WitcherDivider from "$components/theme/WitcherDivider.svelte";
  import type { Team } from "$lib/content/teams";
  import type { TeamMember } from "$lib/server/services/lizzy";
  import { outlineToPath, THEME_COLORS, THEME_CORNERS, type GameTheme } from "$lib/themes";
  import { tw, type CornerConfig } from "$lib/utils";
  import TeamBadge from "./TeamBadge.svelte";

  export let team: Team;
  export let member: TeamMember;

  const THEMES: Record<
    GameTheme,
    Record<"base" | "header" | "name" | "image" | "content" | "links" | "frame", string>
  > = {
    cyberpunk: {
      base: tw``,
      header: tw`pl-2`,
      name: tw`cyber-text`,
      image: tw``,
      content: THEME_COLORS.cyberpunk.border.text,
      links: tw``,
      frame: tw``,
    },
    witcher: {
      base: tw`bg-zinc-800`,
      header: tw`border-none px-6`,
      name: tw`small-caps font-[Metamorphous] text-witcher-gold`,
      image: tw`mt-px drop-shadow-px`,
      content: tw`pb-4`,
      links: tw`mr-1`,
      frame: tw`drop-shadow-px`,
    },
  };

  const CORNERS: Record<GameTheme, CornerConfig> = {
    cyberpunk: { tr: true, bl: true },
    witcher: { tl: true, tr: true, br: true },
  };

  // Align right side of the item with integers cuz of firefox rendering issues
  let container: HTMLElement;
  let clientWidth = 0;
  let compensateWidth = 0;
  $: if (container && clientWidth) {
    const rect = container.getBoundingClientRect();
    const width = rect.width + rect.x;
    compensateWidth = Math.ceil(width) - width - compensateWidth;
  }

  $: colors = THEME_COLORS[member.theme ?? "default"];
  $: theme = member.theme && member.theme != "default" ? THEMES[member.theme] : undefined;
  $: corners = member.theme && member.theme != "default" ? CORNERS[member.theme] : undefined;
  $: clipPath =
    member.theme && THEME_CORNERS[member.theme] && outlineToPath(THEME_CORNERS[member.theme]!.outline, corners);
</script>

<li
  bind:this={container}
  bind:clientWidth
  class={twMerge(
    "witcher-clip relative flex w-full flex-shrink flex-grow flex-col",
    "md:max-w-[48%] lg:max-w-[30%] 2xl:max-w-[24%]",
    colors.background,
    theme?.base,
  )}
  style:clip-path={clipPath}
  style:padding-right="{compensateWidth}px"
>
  <h3
    class={twMerge(
      "relative flex flex-wrap items-center justify-between gap-x-4 border-b-2 p-2 pl-4 text-white",
      colors.border.border,
      colors.background,
      theme?.header,
    )}
  >
    <span class={twMerge("text-2xl font-semibold leading-none", theme?.name)}>{member.Displayname}</span>

    {#if member.Teams.size}
      <ul class="flex flex-wrap gap-px">
        {#each member.Teams as team, i (i)}
          <li><TeamBadge {team} /></li>
        {/each}
      </ul>
    {/if}

    {#if member.theme == "witcher"}
      <div class="absolute -bottom-0.5 -left-px right-0 flex h-0 text-zinc-400">
        <span class="-mt-0.5 inline-block h-0 w-[130px] translate-x-px border-b-2 border-current" />
        <WitcherDivider withoutCorners class="flex-grow rotate-180 text-inherit drop-shadow-px" />
      </div>
    {/if}
  </h3>

  <div class="flex w-full">
    <div class={twMerge("relative flex-shrink-0", theme?.image)}>
      <Image src={fuzz} width={96} height={96} class="size-32 object-cover" />

      {#if member.theme}
        <ThemeFrameSmall theme={member.theme} />
      {/if}
    </div>

    <div class={twMerge("relative flex h-full flex-grow flex-col p-2 text-zinc-300", theme?.content)}>
      <p class={twMerge("pl-2 pt-1 leading-tight")}>{member.description || `Member of the ${team.label}.`}</p>

      <div class="mt-auto flex items-end gap-2">
        <div class="hyphens-auto text-sm leading-none">
          <FontAwesomeIcon icon={faDiscord} class="mr-0.5 mt-px" />
          @{member.Username}
        </div>

        <Button inline href="/" class="ml-auto mr-1 leading-none">detail</Button>
      </div>
    </div>
  </div>

  <ThemeFrameBig theme={member.theme} {corners} class={theme?.frame} />
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
