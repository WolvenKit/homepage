<script lang="ts">
  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";
  import GlitchingImage from "$components/elements/GlitchingImage.svelte";
  import Heading from "$components/elements/Heading.svelte";
  import Image from "$components/elements/Image.svelte";
  import ThemeButton from "$components/theme/ThemeButton.svelte";
  import ThemeFrameBig from "$components/theme/ThemeFrameBig.svelte";
  import type { Project } from "$lib/content/projects";
  import { outlineToPath, THEME_CLASSES, THEME_CORNERS, type GameTheme } from "$lib/themes";
  import type { CornerConfig } from "$lib/utils";

  export let fadeInDelay: number | undefined = undefined;
  export let project: Project;

  const CORNERS: Record<GameTheme, CornerConfig> = {
    cyberpunk: { tr: true, bl: true },
    witcher: { tl: true, tr: true, bl: true },
  };

  $: themeName = project.theme ?? ("default" as const);
  $: corners = project.theme && CORNERS[project.theme];
  $: themeClasses = THEME_CLASSES[themeName];
  $: clipPath = THEME_CORNERS[themeName] && outlineToPath(THEME_CORNERS[themeName]!.outline, corners);

  $: githubs = !project.githubs || Array.isArray(project.githubs) ? project.githubs : [project.githubs];
</script>

<li
  class={twMerge("relative flex max-md:flex-col", themeClasses.background)}
  class:fade-in={fadeInDelay != undefined}
  style:--fade-delay="{fadeInDelay}s"
  style:--fade-duration="1s"
  style:clip-path={clipPath}
>
  <ThemeFrameBig theme={themeName} {corners} />

  {#if project.image}
    <svelte:component
      this={themeName == "cyberpunk" ? GlitchingImage : Image}
      width="720"
      height="405"
      src={project.image}
      alt={project.name}
      class="h-auto w-96 flex-shrink-0 object-cover max-md:w-full"
    />
  {/if}

  <div class="flex flex-grow flex-col items-start">
    <div class="px-6 py-4">
      <Heading level={2} class="m-0 text-left normal-case text-white">{project.name}</Heading>
      <p class="text-pretty leading-tight">{project.description}</p>
    </div>

    <div class="mt-auto flex w-full items-end gap-2 max-lg:flex-wrap">
      {#if githubs}
        <ul class="flex flex-wrap items-start gap-x-2 p-2 pl-3">
          {#each githubs as github (github)}
            <li class="inline">
              <a
                href="https://github.com/{github}"
                class="inline-block text-pretty leading-none text-cyan transition hover:text-cyan-light hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faGithub} />
                {github}
              </a>
            </li>
          {/each}
        </ul>
      {/if}

      {#if project.link}
        <ThemeButton class="ml-auto flex-shrink-0" href={project.link} theme={themeName}>Visit project</ThemeButton>
      {/if}
    </div>
  </div>
</li>
