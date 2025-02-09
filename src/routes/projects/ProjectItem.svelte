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
    <div class="relative -z-10 h-32 w-full shrink-0 overflow-hidden md:h-full md:w-2/5">
      <GlitchingImage
        bypass={themeName != "cyberpunk"}
        width="720"
        height="405"
        src={project.image}
        alt={project.name}
        class=""
        imageClass="max-h-full max-w-full absolute inset-0 object-cover max-md:h-auto max-md:w-full md:max-w-96"
      />
    </div>
  {/if}

  <div class="flex grow flex-col items-start">
    <div class="px-6 pt-4">
      <Heading level={2} class="mt-0 -mb-2 -ml-0.5 text-left text-white normal-case">{project.name}</Heading>
      {#if project.author}
        {@const member = memberMapResult ? memberMapResult[project.author] : undefined}
        <div class="mt-1 -mb-2">
          <Button inline href="/members/{project.author}" class="normal-case">
            {member ? member.Displayname : project.author}
          </Button>
        </div>
      {/if}
      <p class="mt-2 leading-tight text-pretty">{project.description}</p>
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
            class="text-cyan hover:text-cyan-light inline-block leading-none text-pretty transition hover:underline"
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
          class="text-cyan hover:text-cyan-light inline-block leading-none text-pretty whitespace-nowrap transition hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon fixedWidth icon={faDiscord} />
          Discord
        </a>
      {/if}

      {#if project.link}
        <ThemeButton class="order-first -mr-4 -mb-4 ml-auto shrink-0" href={project.link} theme={themeName}>
          Visit project
        </ThemeButton>
      {/if}
    </div>
  </div>
</li>
