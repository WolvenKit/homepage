<script lang="ts">
  import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";
  import Image from "$components/elements/Image.svelte";
  import ThemeButton from "$components/theme/ThemeButton.svelte";
  import ThemeFrameBig from "$components/theme/ThemeFrameBig.svelte";
  import WitcherDivider from "$components/theme/WitcherDivider.svelte";
  import WitcherFrame from "$components/theme/WitcherFrame.svelte";
  import GlitchingImage from "$lib/components/elements/GlitchingImage.svelte";
  import type { Team } from "$lib/content/teams";
  import type { TeamMember } from "$lib/server/members";
  import { outlineToPath, THEME_COLORS, THEME_CORNERS, type GameTheme } from "$lib/themes";
  import { tw, type CornerConfig } from "$lib/utils";
  import TeamBadge from "./TeamBadge.svelte";

  export let team: Team;
  export let member: TeamMember;
  export let fadeInDelay = 0;

  const THEMES: Record<
    GameTheme,
    Record<"base" | "header" | "name" | "image" | "content" | "links" | "frame", string>
  > = {
    cyberpunk: {
      base: tw``,
      header: tw``,
      name: tw`text-yellow`,
      image: tw``,
      content: tw`text-cyan`,
      links: tw``,
      frame: tw``,
    },
    witcher: {
      base: tw`bg-zinc-800`,
      header: tw`border-transparent px-6`,
      name: tw`small-caps font-[Metamorphous] text-witcher-gold`,
      image: tw`border-transparent drop-shadow-px`,
      content: tw``,
      links: tw`mr-1`,
      frame: tw`drop-shadow-px`,
    },
  };

  const CORNERS: Record<GameTheme, CornerConfig> = {
    cyberpunk: { tr: true, bl: true },
    witcher: { tl: true, tr: true },
  };

  $: themeName = member.CustomData?.theme ?? "default";
  $: colors = THEME_COLORS[themeName];
  $: theme = themeName != "default" ? THEMES[themeName] : undefined;
  $: corners = themeName != "default" ? CORNERS[themeName] : undefined;
  $: clipPath = THEME_CORNERS[themeName] && outlineToPath(THEME_CORNERS[themeName]!.outline, corners);
</script>

<li
  class={twMerge(
    "item fade-in relative flex w-full flex-shrink flex-grow flex-col",
    "max-w-[round(100%,1px)] md:max-w-[round(48%,1px)] lg:max-w-[round(30%,1px)] 2xl:max-w-[round(24%,1px)]",
    colors.background,
    theme?.base,
  )}
  style:clip-path={clipPath}
  style:--fade-delay="{fadeInDelay}s"
  style:--fade-duration="0.5s"
>
  <h3
    class={twMerge(
      "relative flex flex-wrap items-center justify-between gap-x-4 border-b-2 p-2 pb-1.5 pl-4 text-white",
      colors.border.border,
      colors.background,
      theme?.header,
    )}
  >
    <a href="/members/{member.Username}" class={twMerge("text-2xl font-semibold leading-none", theme?.name)}>
      {member.Displayname}
    </a>

    {#if member.Teams.size}
      <ul class="flex flex-wrap gap-px">
        {#each member.Teams as team, i (i)}
          <li><TeamBadge {team} /></li>
        {/each}
      </ul>
    {/if}

    {#if themeName == "witcher"}
      <div class="absolute -bottom-0.5 -left-px right-0 flex h-0 text-zinc-400">
        <span class="-mt-0.5 inline-block h-0 w-[130px] translate-x-px border-b-2 border-current" />
        <WitcherDivider withoutCorners class="flex-grow rotate-180 text-inherit drop-shadow-px" />
      </div>
    {/if}
  </h3>

  <div>
    <div class={twMerge("relative float-left -mt-0.5 border-2", colors.border.border, theme?.image)}>
      <svelte:component
        this={themeName == "cyberpunk" ? GlitchingImage : Image}
        src={member.Image + "?size=128"}
        width={128}
        height={128}
        class="size-32 object-cover"
      />

      {#if themeName == "witcher"}
        <WitcherFrame class="-inset-px" />
      {/if}
    </div>

    <div class={twMerge("relative flex h-full flex-grow flex-col p-2 text-zinc-300", theme?.content)}>
      <p class={twMerge("line-clamp-3 pl-2 pt-1 leading-tight")}>
        {member.CustomData?.description || `Member of the ${team.label}.`}
      </p>

      <div class="mt-auto flex items-end gap-2">
        <div class="hyphens-auto text-sm leading-none">
          <FontAwesomeIcon icon={faDiscord} class="mr-0.5 mt-px" />
          @{member.Username}
        </div>

        <div class="relative z-10 -mb-1.5 -mr-2 ml-auto translate-y-0.5">
          <ThemeButton href="/members/{member.Username}" theme={themeName} size="sm">detail</ThemeButton>
        </div>
      </div>
    </div>
  </div>

  <ThemeFrameBig theme={themeName} {corners} class={theme?.frame} />
</li>

<style>
  .item {
    content-visibility: auto;
  }

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
