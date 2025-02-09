<script lang="ts">
  import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";
  import fuzzo from "$assets/fuzzo.png";
  import GlitchingImage from "$components/elements/GlitchingImage.svelte";
  import LazyImage from "$components/elements/LazyImage.svelte";
  import ThemeButton from "$components/theme/ThemeButton.svelte";
  import ThemeFrameBig from "$components/theme/ThemeFrameBig.svelte";
  import WitcherDivider from "$components/theme/WitcherDivider.svelte";
  import WitcherFrame from "$components/theme/WitcherFrame.svelte";
  import type { Team } from "$lib/content/teams";
  import type { TeamMember } from "$lib/server/members";
  import { outlineToPath, THEME_CLASSES, THEME_CORNERS, type GameTheme } from "$lib/themes";
  import { tw, type CornerConfig } from "$lib/utils";
  import Description from "./Description.svelte";
  import TeamBadge from "./TeamBadge.svelte";

  const THEMES: Record<GameTheme, Record<"base" | "header" | "name" | "image" | "links" | "frame", string>> = {
    cyberpunk: {
      base: tw``,
      header: tw``,
      name: tw`text-yellow`,
      image: tw``,
      links: tw``,
      frame: tw``,
    },
    witcher: {
      base: tw`bg-zinc-800`,
      header: tw`border-transparent px-6`,
      name: tw`small-caps font-witcher text-witcher-gold`,
      image: tw`drop-shadow-px border-transparent`,
      links: tw`mr-1`,
      frame: tw`drop-shadow-px`,
    },
  };

  interface Props {
    team: Team;
    member: TeamMember;
    fadeInDelay?: number;
  }

  let { team, member, fadeInDelay = 0 }: Props = $props();

  let fuzzoed = $state(false);

  function onDrop(ev: DragEvent) {
    const data = ev.dataTransfer?.getData("text/plain");
    if (data && decodeURIComponent(data).includes("/cat_")) {
      fuzzoed = true;
    }
  }

  function preventDefault(ev: Event) {
    ev.preventDefault();
  }

  const CORNERS: Record<GameTheme, CornerConfig> = {
    cyberpunk: { tr: true, bl: true },
    witcher: { tl: true, tr: true },
  };

  let themeName = $derived(member.CustomData?.theme ?? "default");
  let themeClasses = $derived(THEME_CLASSES[themeName]);
  let theme = $derived(themeName != "default" ? THEMES[themeName] : undefined);
  let corners = $derived(themeName != "default" ? CORNERS[themeName] : undefined);
  let clipPath = $derived(THEME_CORNERS[themeName] && outlineToPath(THEME_CORNERS[themeName]!.outline, corners));

  const ImageComponent = $derived(themeName == "cyberpunk" ? GlitchingImage : LazyImage);
</script>

<li
  class={twMerge(
    "item fade-in relative flex w-full shrink grow flex-col",
    "max-w-[round(100%,1px)] md:max-w-[round(48%,1px)] lg:max-w-[round(30%,1px)] 2xl:max-w-[round(24%,1px)]",
    themeClasses.background,
    theme?.base,
  )}
  style:clip-path={clipPath}
  style:--fade-delay="{fadeInDelay}s"
  style:--fade-duration="0.5s"
>
  <h3
    class={twMerge(
      "relative flex flex-wrap items-center justify-between gap-x-4 border-b-2 p-2 pb-1.5 pl-4 text-white",
      themeClasses.border.border,
      themeClasses.background,
      theme?.header,
    )}
  >
    <a href="/members/{member.Username}" class={twMerge("text-2xl leading-none font-semibold", theme?.name)}>
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
      <div class="absolute right-0 -bottom-0.5 -left-px flex h-0 text-zinc-400">
        <span class="-mt-0.5 inline-block h-0 w-[130px] translate-x-px border-b-2 border-current"></span>
        <WitcherDivider withoutCorners class="drop-shadow-px grow rotate-180 text-inherit" />
      </div>
    {/if}
  </h3>

  <div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class={twMerge("relative float-left -mt-0.5 border-2", themeClasses.border.border, theme?.image)}
      ondragenter={preventDefault}
      ondragover={preventDefault}
      ondrop={onDrop}
    >
      <ImageComponent
        src={fuzzoed ? fuzzo : member.Image + "?size=128"}
        width={128}
        height={128}
        class="size-32 object-cover"
        alt={member.Displayname}
      />

      {#if themeName == "witcher"}
        <WitcherFrame class="-inset-px" />
      {/if}
    </div>

    <div class={twMerge("relative flex h-full grow flex-col p-2", themeClasses.text)}>
      <Description
        class="line-clamp-3 pl-1 leading-none"
        longClass="line-clamp-4"
        text={member.CustomData?.description || `Member of the ${team.label}.`}
      />

      <div class="mt-auto flex flex-row-reverse flex-wrap-reverse items-center justify-end gap-2">
        <div class="text-sm leading-none hyphens-auto">
          <FontAwesomeIcon icon={faDiscord} class="mt-px mr-0.5" />
          @{member.Username}
        </div>

        <div class="relative z-10 order-first -mr-2 -mb-1.5 ml-auto translate-y-0.5">
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
    border: 2px solid var(-colors-red);
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
