<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import GlitchingImage from "$lib/components/elements/GlitchingImage.svelte";
  import Heading from "$lib/components/elements/Heading.svelte";
  import Image from "$lib/components/elements/Image.svelte";
  import ThemeButton from "$lib/components/theme/ThemeButton.svelte";
  import ThemeFrameBig from "$lib/components/theme/ThemeFrameBig.svelte";
  import { getProjectLink, type Project } from "$lib/content/projects";
  import { outlineToPath, THEME_COLORS, THEME_CORNERS, type GameTheme } from "$lib/themes";
  import type { CornerConfig } from "$lib/utils";

  export let fadeInDelay: number | undefined = undefined;
  export let project: Project;

  const CORNERS: Record<GameTheme, CornerConfig> = {
    cyberpunk: { tr: true, bl: true },
    witcher: { tl: true, tr: true, bl: true },
  };

  $: themeName = project.theme ?? ("default" as const);
  $: corners = project.theme && CORNERS[project.theme];
  $: colors = THEME_COLORS[themeName];
  $: clipPath = THEME_CORNERS[themeName] && outlineToPath(THEME_CORNERS[themeName]!.outline, corners);
  $: link = getProjectLink(project);
</script>

<li
  class={twMerge("relative flex max-md:flex-col", colors.background)}
  class:fade-in={fadeInDelay != undefined}
  style:--fade-delay="{fadeInDelay}s"
  style:--fade-duration="1s"
  style:clip-path={clipPath}
>
  <ThemeFrameBig theme={themeName} {corners} />

  <svelte:component
    this={themeName == "cyberpunk" ? GlitchingImage : Image}
    width="720"
    height="405"
    src={project.image}
    class="h-auto w-96 object-cover max-md:w-full"
  />

  <div class="flex flex-grow flex-col items-start">
    <div class="p-6">
      <Heading level={2} class="m-0 normal-case text-white">{project.name}</Heading>
      {project.description}
    </div>

    <div class="ml-auto mt-auto">
      {#if link}
        <ThemeButton href={link[1]} theme={themeName}>Visit project</ThemeButton>
      {/if}
    </div>
  </div>
</li>
