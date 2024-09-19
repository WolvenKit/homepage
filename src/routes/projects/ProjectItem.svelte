<script lang="ts">
  import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord";
  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";
  import GlitchingImage from "$components/elements/GlitchingImage.svelte";
  import Heading from "$components/elements/Heading.svelte";
  import ThemeButton from "$components/theme/ThemeButton.svelte";
  import ThemeFrameBig from "$components/theme/ThemeFrameBig.svelte";
  import Button from "$lib/components/elements/Button.svelte";
  import type { Project } from "$lib/content/projects";
  import type { TeamMember } from "$lib/server/members";
  import { outlineToPath, THEME_CLASSES, THEME_CORNERS, type GameTheme } from "$lib/themes";
  import { asPromise, type CornerConfig, type Promisable } from "$lib/utils";

  export let memberMap: Promisable<Record<string, TeamMember>> | undefined = undefined;
  export let fadeInDelay: number | undefined = undefined;
  export let project: Project;

  const CORNERS: Record<GameTheme, CornerConfig> = {
    cyberpunk: { tr: true, bl: true },
    witcher: { tl: true, tr: true, bl: true },
  };

  let memberMapResult: Record<string, TeamMember> = {};
  $: if (memberMap) asPromise(memberMap).then((v) => (memberMapResult = v));

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
    <div class="px-6 py-4">
      <Heading level={2} class="-mb-2 mt-0 text-left normal-case text-white">{project.name}</Heading>
      {#if project.author}
        {@const member = memberMapResult ? memberMapResult[project.author] : undefined}
        <Button inline href="/members/{project.author}" class="ml-0.5 normal-case">
          {member ? member.Displayname : project.author}
        </Button>
      {/if}
      <p class="mt-2 text-pretty leading-tight">{project.description}</p>
    </div>

    <div class="mt-auto flex w-full items-end gap-2 max-lg:flex-wrap">
      {#if githubs}
        <ul class="flex flex-wrap items-start gap-x-2 p-2 pl-3" class:ml-2={!project.image}>
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

      {#if project.discord}
        <a
          href={project.discord}
          class="m-2 mb-3 inline-block whitespace-nowrap text-pretty leading-none text-cyan transition hover:text-cyan-light hover:underline"
          class:ml-6={!project.image}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faDiscord} />
          Discord
        </a>
      {/if}

      {#if project.link}
        <ThemeButton class="ml-auto flex-shrink-0" href={project.link} theme={themeName}>Visit project</ThemeButton>
      {/if}
    </div>
  </div>
</li>
