<script lang="ts">
  import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord";

  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";
  import Button from "$components/elements/Button.svelte";
  import GlitchingImage from "$components/elements/GlitchingImage.svelte";
  import Heading from "$components/elements/Heading.svelte";
  import ThemeButton from "$components/theme/ThemeButton.svelte";
  import ThemeFrameBig from "$components/theme/ThemeFrameBig.svelte";
  import type { Project } from "$lib/content/projects";
  import type { TeamMember } from "$lib/server/members";
  import { outlineToPath, THEME_CLASSES, THEME_CORNERS, type GameTheme } from "$lib/themes";
  import { asPromise, type CornerConfig, type Promisable } from "$lib/utils";

  interface Props {
    memberMap?: Promisable<Record<string, TeamMember>> | undefined;
    fadeInDelay?: number | undefined;
    project: Project;
  }

  let { memberMap = undefined, fadeInDelay = undefined, project }: Props = $props();

  const CORNERS: Record<GameTheme, CornerConfig> = {
    cyberpunk: { tr: true, bl: true },
    witcher: { tl: true, tr: true, bl: true },
  };

  let memberMapResult: Record<string, TeamMember> = $state({});
  $effect(() => {
    if (memberMap) asPromise(memberMap).then((v) => (memberMapResult = v));
  });

  let themeName = $derived(project.theme ?? ("default" as const));
  let corners = $derived(project.theme && CORNERS[project.theme]);
  let themeClasses = $derived(THEME_CLASSES[themeName]);
  let clipPath = $derived(THEME_CORNERS[themeName] && outlineToPath(THEME_CORNERS[themeName]!.outline, corners));

  let githubs = $derived(!project.githubs || Array.isArray(project.githubs) ? project.githubs : [project.githubs]);
</script>

<li
  class={twMerge(
    "relative flex max-md:flex-col",
    project.style != "category" && "md:col-span-2",
    themeClasses.background,
  )}
  class:fade-in={fadeInDelay != undefined}
  style:--fade-delay="{fadeInDelay}s"
  style:--fade-duration="1s"
  style:clip-path={clipPath}
>
  <ThemeFrameBig theme={themeName} {corners} />

  {#if project.image}
    <GlitchingImage
      bypass={themeName != "cyberpunk"}
      width="720"
      height="405"
      src={project.image}
      alt={project.name}
      class="h-52 max-h-96 w-auto flex-shrink-0 max-md:h-auto max-md:w-full md:max-w-96"
      imageClass="h-52 max-h-96 w-auto object-cover max-md:h-auto max-md:w-full md:max-w-96"
    />
  {/if}

  <div class="flex flex-grow flex-col items-start">
    <div class="px-6 pt-4">
      <Heading level={2} class="-mb-2 -ml-0.5 mt-0 text-left normal-case text-white">{project.name}</Heading>
      {#if project.author}
        {@const member = memberMapResult ? memberMapResult[project.author] : undefined}
        <div class="-mb-2 mt-1">
          <Button inline href="/members/{project.author}" class="normal-case">
            {member ? member.Displayname : project.author}
          </Button>
        </div>
      {/if}
      <p class="mt-2 text-pretty leading-tight">{project.description}</p>
    </div>

    <div
      class={twMerge(
        "mt-auto flex w-full gap-x-4 gap-y-2 p-4",
        project.style == "category"
          ? "flex-col flex-wrap pl-6"
          : "flex-row-reverse flex-wrap-reverse items-center justify-end",
      )}
    >
      {#if githubs}
        {#each githubs as github (github)}
          <a
            href="https://github.com/{github}"
            class="inline-block text-pretty leading-none text-cyan transition hover:text-cyan-light hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon fixedWidth icon={faGithub} />
            {github.split("/").slice(-1)[0]}
          </a>
        {/each}
      {/if}

      {#if project.discord}
        <a
          href={project.discord}
          class="inline-block whitespace-nowrap text-pretty leading-none text-cyan transition hover:text-cyan-light hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon fixedWidth icon={faDiscord} />
          Discord
        </a>
      {/if}

      {#if project.link}
        <ThemeButton class="order-first -mb-4 -mr-4 ml-auto flex-shrink-0" href={project.link} theme={themeName}>
          Visit project
        </ThemeButton>
      {/if}
    </div>
  </div>
</li>
