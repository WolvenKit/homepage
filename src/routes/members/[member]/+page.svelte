<script lang="ts">
  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";
  import Button from "$components/elements/Button.svelte";
  import GlitchingImage from "$components/elements/GlitchingImage.svelte";
  import Heading from "$components/elements/Heading.svelte";
  import LazyImage from "$components/elements/LazyImage.svelte";
  import GlitchingWebsite from "$components/parts/BlackwallScreensaver/GlitchingWebsite.svelte";
  import Card from "$components/parts/Card.svelte";
  import ErrorAlert from "$components/parts/ErrorAlert.svelte";
  import Loading from "$components/parts/Loading.svelte";
  import PageRoot from "$components/parts/PageRoot.svelte";
  import Section from "$components/parts/Section.svelte";
  import Warning from "$components/parts/Warning.svelte";
  import ThemeFrameBig from "$components/theme/ThemeFrameBig.svelte";
  import { projects } from "$lib/content/projects";
  import { teams } from "$lib/content/teams";
  import { THEME_CLASSES } from "$lib/themes";
  import { jsonLd } from "$lib/utils";
  import TeamBadge from "../TeamBadge.svelte";
  import DataEntry from "./DataEntry.svelte";

  const NEXUS_URL = "https://next.nexusmods.com/profile";

  let { data } = $props();

  let game = $state(false);
  let glitchingElement: HTMLElement | undefined = $state();
  let ready = $state(false);

  let member = $derived(data.member);

  let background = $derived(member.CustomData?.background);
  let themeName = $derived(member.CustomData?.theme ?? "default");
  let themeClasses = $derived(THEME_CLASSES[themeName]);

  let contributions = $derived(data.contributions && Object.values(data.contributions));
  let totalContributions = $derived(
    contributions?.reduce(
      (acc, project) => acc + project.reduce((acc2, repo) => acc2 + repo.CommitCount + repo.IssueCount, 0),
      0,
    ),
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
      // Don't trust dzk with her links
      sameAs: member.CustomData?.brokenTheme
        ? []
        : [
            member.CustomData?.nexusmods && `${NEXUS_URL}/${member.CustomData?.nexusmods}`,
            member.CustomData?.github && `https://github.com/${member.CustomData?.github}`,
          ].filter((v) => v),
    },
  })}

  <meta property="og:image:width" content="256" />
  <meta property="og:image:height" content="256" />
  <meta property="profile:username" content={member.Username} />
</svelte:head>

<PageRoot
  bind:element={glitchingElement}
  title={[member.Displayname, "Member detail"]}
  description={member.CustomData?.description || "Member of the RedModding community"}
  image={member.Image}
  card="summary"
  type="profile"
  hideDescription
  class="relative"
>
  {#if member.CustomData?.brokenTheme && ready}
    <GlitchingWebsite
      class="absolute -inset-0 -top-24 z-10"
      rootElement={glitchingElement}
      updateChance={0.2}
      blankChance={0.5}
      resetChanceMultiplier={0.1}
      movementRange={0.01}
      backgroundColor={[0, 0, 0, 0]}
      forceAlphaChance={0}
      colorBlockChance={0}
      replaceBackgroundChance={0}
    />
  {/if}

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
        <LazyImage
          src={background}
          class={twMerge(
            "member-profile-background fade-in contrast-more:hidden",
            "absolute -left-8 -right-8 -top-4 -z-10 h-auto max-h-96 w-[calc(100%+4rem)] max-w-[unset] object-cover",
            "rounded-t-3xl opacity-50 mix-blend-screen contrast-125",
          )}
        />
      {/if}

      <div class="mb-8 inline-flex flex-wrap gap-4 gap-x-8 px-2 max-md:justify-center">
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="fade-in relative flex-shrink-0" style:--fade-delay=".7s" ondblclick={() => (game = true)}>
          <ThemeFrameBig theme={themeName}>
            {@const ImageComponent = themeName == "cyberpunk" ? GlitchingImage : LazyImage}
            <ImageComponent
              class="size-48"
              src={member.Image + "?size=256"}
              width={192}
              height={192}
              alt={member.Displayname}
            />

            {#if member.CustomData?.brokenTheme}
              <Warning class="absolute -right-4 -top-4 z-10 size-24 mix-blend-screen" />
            {/if}
          </ThemeFrameBig>
        </div>

        <div class="flex max-w-full flex-grow flex-col justify-center gap-4 max-md:text-center">
          <div class="fade-in">
            <Heading
              level={2}
              class={twMerge(
                "small-caps m-0 max-w-full overflow-hidden text-ellipsis text-4xl font-semibold normal-case leading-none text-white md:text-left",
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

      <div class="fade-in max-md:text-center md:float-right md:mb-16 md:ml-8" style:--fade-delay="1.2s">
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

      {#if member.CustomData?.brokenTheme}
        <Warning class="size-24 md:float-right md:mt-14" />
      {/if}

      <dl
        class="fade-in clear-left mb-8 flex flex-wrap items-end justify-around gap-4 px-4 text-center"
        style:--fade-delay="1s"
      >
        {#if member.NexusData?.userByName?.country}
          <DataEntry theme={themeName} key="Country" crossed={member.CustomData?.brokenTheme}>
            {member.NexusData.userByName.country}
          </DataEntry>
        {/if}

        {#if member.NexusData?.userByName?.kudos}
          <DataEntry theme={themeName} key="Kudos" crossed={member.CustomData?.brokenTheme}>
            {member.NexusData.userByName.kudos.toLocaleString()}
          </DataEntry>
        {/if}

        {#if member.NexusData?.userByName?.modCount}
          <DataEntry theme={themeName} key="Mods released" crossed={member.CustomData?.brokenTheme}>
            {member.NexusData?.userByName?.modCount.toLocaleString()}
          </DataEntry>
        {/if}

        {#if member.NexusData?.userByName?.uniqueModDownloads}
          <DataEntry theme={themeName} key="Mod downloads" crossed={member.CustomData?.brokenTheme}>
            {member.NexusData.userByName.uniqueModDownloads.toLocaleString()}
          </DataEntry>
        {/if}

        {#if totalContributions}
          <DataEntry theme={themeName} key="Contributions" crossed={member.CustomData?.brokenTheme}>
            {totalContributions.toLocaleString()}
          </DataEntry>
        {/if}

        {#if member.CustomData?.github}
          <DataEntry theme={themeName} key="GitHub" crossed={member.CustomData?.brokenTheme}>
            <Button inline hideExternal href="https://github.com/{member.CustomData?.github}" class="inline text-lg">
              @{member.CustomData?.github}
            </Button>
          </DataEntry>
        {/if}

        {#if member.CustomData?.nexusmods}
          <DataEntry theme={themeName} key="NexusMods" crossed={member.CustomData?.brokenTheme}>
            <Button inline hideExternal href="{NEXUS_URL}/{member.CustomData?.nexusmods}" class="inline text-lg">
              @{member.CustomData?.nexusmods}
            </Button>
          </DataEntry>
        {/if}
      </dl>

      {#if game}
        {#await import("$components/parts/DinoGame.svelte") then { default: DinoGame }}
          <DinoGame sprite={member.Image + "?size=64"} on:exit={() => (game = false)} />
        {/await}
      {/if}
    </header>

    <div class="contents" style:--fade-delay="2.5s" onanimationend={() => (ready = true)}>
      {#if member.NexusData?.mods?.nodes.length}
        <Section as="section" class="fade-in m-0">
          <Heading level={2}>Top rated released mods</Heading>

          <ul class="flex flex-wrap justify-center gap-2">
            {#each member.NexusData.mods.nodes as mod}
              <li>
                <Card
                  titleText={mod.name}
                  href="https://www.nexusmods.com/{mod.game.domainName}/mods/{mod.modId}"
                  class="h-full"
                >
                  {#snippet logo()}
                    <LazyImage src={mod.pictureUrl} width={385} height={216} />
                  {/snippet}
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
            {#each Object.entries(data.contributions) as [projectId, repositories] (projectId)}
              {@const project = projects[projectId]}
              {@const projectTheme = project.theme ?? "default"}

              <li class="max-md:w-full">
                <ThemeFrameBig class={twMerge("flex flex-col gap-4 px-4", THEME_CLASSES[projectTheme].background)}>
                  <div class="-mx-4 h-32 min-w-64 flex-shrink-0">
                    {#if project.image}
                      <LazyImage
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
                    {#each repositories as repo}
                      {@const repoContributions = { commits: repo.CommitCount, issues: repo.IssueCount }}

                      <li class="mb-2">
                        <a
                          href="https://github.com/{repo.Repository}/commits?author={member.CustomData?.github}"
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
                              {repo.Repository.split("/")[1]}
                            </Button>

                            <ul class="list-outside list-dash">
                              {#each Object.entries(repoContributions).filter(([_, a]) => a) as [type, amount] (type)}
                                <li class="-mt-2 ml-2 pl-1">
                                  <strong>{amount}</strong>
                                  {type.slice(0, -1)}{#if amount > 1}s{/if}
                                </li>
                              {/each}
                            </ul>
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
