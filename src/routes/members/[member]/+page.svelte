<script lang="ts">
  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";
  import Button from "$components/elements/Button.svelte";
  import GlitchingImage from "$components/elements/GlitchingImage.svelte";
  import Heading from "$components/elements/Heading.svelte";
  import Image, { vercelImg } from "$components/elements/Image.svelte";
  import Card from "$components/parts/Card.svelte";
  import ErrorAlert from "$components/parts/ErrorAlert.svelte";
  import Loading from "$components/parts/Loading.svelte";
  import PageRoot from "$components/parts/PageRoot.svelte";
  import Section from "$components/parts/Section.svelte";
  import ThemeFrameBig from "$components/theme/ThemeFrameBig.svelte";
  import { PUBLIC_NEXUS_PROFILE_URL } from "$env/static/public";
  import { projects } from "$lib/content/projects";
  import { teams } from "$lib/content/teams";
  import { THEME_CLASSES } from "$lib/themes";
  import { jsonLd } from "$lib/utils";
  import TeamBadge from "../TeamBadge.svelte";
  import DataEntry from "./DataEntry.svelte";

  export let data;

  $: member = data.member;

  $: background = member.CustomData?.background;
  $: themeName = member.CustomData?.theme ?? "default";
  $: themeClasses = THEME_CLASSES[themeName];

  $: contributions = data.contributions && Object.values(data.contributions);
  $: totalContributions = contributions?.reduce(
    (acc, project) => acc + Object.values(project.repositoryCommits).reduce((acc2, repo) => acc2 + repo, 0),
    0,
  );
</script>

<svelte:head>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonLd({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: member.Displayname,
      alternateName: member.Username,
      description: member.CustomData?.description,
      image: member.Image,
      sameAs: [
        member.CustomData?.nexusmods && `${PUBLIC_NEXUS_PROFILE_URL}/${member.CustomData?.nexusmods}`,
        member.CustomData?.github && `https://github.com/${member.CustomData?.github}`,
      ].filter((v) => v),
    },
  })}

  <meta property="profile:username" content={member.Username} />
</svelte:head>

<PageRoot
  title={[member.Displayname, "Member detail"]}
  description={member.CustomData?.description || "Member of the RedModding community"}
  image={vercelImg(member.Image, 128, 100)}
  card="summary"
  type="profile"
  hideDescription
>
  {#await data}
    <Loading />
  {:then data}
    <header
      class="relative w-full max-w-screen-lg pt-16 text-left max-md:mt-4"
      class:text-shadow={background}
      style:--fade-duration="1s"
    >
      <Button href="." icon={faArrowLeft} class="absolute bottom-full text-opacity-75 md:mb-4">See all members</Button>

      {#if background}
        <Image
          src={background}
          class={twMerge(
            "member-profile-background fade-in contrast-more:hidden",
            "absolute -left-8 -right-8 -top-4 -z-10 h-auto max-h-96 w-[calc(100%+4rem)] max-w-[unset] object-cover",
            "rounded-t-3xl opacity-50 mix-blend-screen contrast-125",
          )}
        />
      {/if}

      <div class="mb-8 inline-flex flex-wrap gap-4 gap-x-8 px-2 max-md:justify-center">
        <div class="fade-in relative flex-shrink-0" style:--fade-delay=".7s">
          <ThemeFrameBig theme={themeName} />

          <svelte:component
            this={themeName == "cyberpunk" ? GlitchingImage : Image}
            class="size-48"
            src={member.Image + "?size=256"}
            width={192}
            height={192}
            alt={member.Displayname}
          />
        </div>

        <div class="flex max-w-full flex-grow flex-col justify-center gap-4 max-md:text-center">
          <div class="fade-in">
            <Heading
              level={2}
              class={twMerge(
                "small-caps m-0 text-4xl font-semibold normal-case leading-none text-white md:text-left",
                themeName == "witcher" && "font-witcher text-3xl",
              )}
            >
              {member.Nickname || member.Displayname}
            </Heading>

            {#if member.Nickname}
              <p class="-mt-1 text-xl uppercase text-zinc-300">@{member.Username}</p>
            {/if}
          </div>

          {#if member.CustomData?.description}
            <p class={twMerge("fade-in max-w-screen-sm", themeClasses.text)} style:--fade-delay=".3s">
              {member.CustomData.description}
            </p>
          {/if}
        </div>
      </div>

      <div class="fade-in mb-16 ml-8 max-md:text-center md:float-right" style:--fade-delay="1.2s">
        <Heading level={3} class="mb-2">Teams</Heading>

        <ul class="inline-flex flex-col gap-2">
          {#each member.Teams as teamId, i (teamId)}
            {@const team = teams[teamId]}
            <li
              class="fade-in flex items-center gap-2 text-xl font-semibold leading-none text-zinc-400"
              style:--fade-duration=".5s"
              style:--fade-delay="{1.5 + i * 0.2}s"
            >
              <TeamBadge {team} />
              {team.label}
            </li>
          {/each}
        </ul>
      </div>

      <dl
        class="fade-in clear-left mb-8 flex items-end justify-around gap-4 px-4 text-center max-lg:flex-wrap"
        style:--fade-delay="1s"
      >
        {#if data.nexus?.user.country}
          <DataEntry theme={themeName} key="Country">{data.nexus.user.country}</DataEntry>
        {/if}

        {#if data.nexus?.user.kudos}
          <DataEntry theme={themeName} key="Kudos">{data.nexus.user.kudos.toLocaleString()}</DataEntry>
        {/if}

        {#if data.nexus?.["user-mods-count"].mods.totalCount}
          <DataEntry theme={themeName} key="Mods released"
            >{data.nexus?.["user-mods-count"].mods.totalCount.toLocaleString()}</DataEntry
          >
        {/if}

        {#if data.nexus?.user.uniqueModDownloads}
          <DataEntry theme={themeName} key="Mod downloads"
            >{data.nexus.user.uniqueModDownloads.toLocaleString()}</DataEntry
          >
        {/if}

        {#if totalContributions}
          <DataEntry theme={themeName} key="Contributions">{totalContributions.toLocaleString()}</DataEntry>
        {/if}

        {#if member.CustomData?.github}
          <DataEntry theme={themeName} key="GitHub">
            <Button inline hideExternal href="https://github.com/{member.CustomData?.github}" class="text-lg">
              @{member.CustomData?.github}
            </Button>
          </DataEntry>
        {/if}

        {#if member.CustomData?.nexusmods}
          <DataEntry theme={themeName} key="NexusMods">
            <Button
              inline
              hideExternal
              href="{PUBLIC_NEXUS_PROFILE_URL}/{member.CustomData?.nexusmods}"
              class="text-lg"
            >
              @{member.CustomData?.nexusmods}
            </Button>
          </DataEntry>
        {/if}
      </dl>
    </header>

    <div class="contents" style:--fade-delay="2.5s">
      {#if data.nexus?.mods.length}
        <Section as="section" class="fade-in m-0">
          <Heading level={2}>Top rated released mods</Heading>

          <ul class="flex flex-wrap justify-center gap-2">
            {#each data.nexus.mods as mod}
              <li>
                <Card title={mod.name} href="https://www.nexusmods.com/{mod.game.domainName}/mods/{mod.modId}">
                  <Image slot="logo" src={mod.thumbnailUrl} width={385} height={216} />
                  {mod.summary}
                </Card>
              </li>
            {/each}
          </ul>
        </Section>
      {/if}

      {#if contributions?.length}
        <Section as="section" class="fade-in m-0">
          <Heading level={2}>Project contributions</Heading>

          <ul class="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {#each contributions as contribution (contribution)}
              {@const project = projects[contribution.projectId]}
              {@const projectTheme = project.theme ?? "default"}
              <li class="max-md:w-full">
                <ThemeFrameBig class={twMerge("flex flex-col gap-4 px-4", THEME_CLASSES[projectTheme].background)}>
                  <div class="-mx-4 h-32 min-w-64 flex-shrink-0">
                    {#if project.image}
                      <Image
                        width="720"
                        height="405"
                        src={project.image}
                        alt={project.name}
                        class="h-32 w-full object-cover"
                      />
                    {/if}
                  </div>

                  <Heading level={3} class="mb-0 text-left">{project.name}</Heading>

                  <p class={twMerge("w-0 min-w-full", THEME_CLASSES[projectTheme].text)}>
                    {project.description}
                  </p>

                  <ul class={twMerge(THEME_CLASSES[projectTheme].text)}>
                    {#each Object.entries(contribution.repositoryCommits) as [repo, commits]}
                      <li class="mb-2">
                        <a
                          href="https://github.com/{repo}/commits?author={member.CustomData?.github}"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="hover-glow group flex items-center gap-4"
                        >
                          <FontAwesomeIcon
                            icon={faGithub}
                            size="xl"
                            class="text-zinc-400 transition group-hover-focus:text-cyan"
                          />

                          <div>
                            <Button
                              inline
                              external
                              class="text-pretty text-left hover-focus:text-cyan hover-focus:filter-none"
                            >
                              {repo.split("/")[1]}
                            </Button>

                            <div class="-mt-2 ml-2">
                              &ndash; <strong>{commits}</strong> commit{#if commits > 1}s{/if}
                            </div>
                          </div>
                        </a>
                      </li>
                    {/each}
                  </ul>
                </ThemeFrameBig>
              </li>
            {/each}
          </ul>
        </Section>
      {/if}
    </div>
  {:catch error}
    <ErrorAlert {error} />
  {/await}
</PageRoot>

<style>
  :global(.member-profile-background) {
    mask-image: linear-gradient(to bottom, transparent, white 2rem, transparent),
      linear-gradient(to right, transparent, white 2rem, white calc(100% - 2rem), transparent);
    mask-composite: intersect;

    --fade-delay: 2s;
    --fade-duration: 2s;
  }
</style>
