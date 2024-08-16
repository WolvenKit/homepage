<script lang="ts">
  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
  import { twMerge } from "tailwind-merge";
  import Button from "$components/elements/Button.svelte";
  import Heading from "$components/elements/Heading.svelte";
  import Image from "$components/elements/Image.svelte";
  import Card from "$components/parts/Card.svelte";
  import ErrorAlert from "$components/parts/ErrorAlert.svelte";
  import Loading from "$components/parts/Loading.svelte";
  import PageRoot from "$components/parts/PageRoot.svelte";
  import Section from "$components/parts/Section.svelte";
  import { PUBLIC_NEXUS_PROFILE_URL } from "$env/static/public";
  import { projects } from "$lib/content/projects";
  import { teams } from "$lib/content/teams";
  import { jsonLd } from "$lib/utils";
  import TeamBadge from "../TeamBadge.svelte";
  import DataEntry from "./DataEntry.svelte";

  export let data;

  $: background = data.member.CustomData?.background;
</script>

<svelte:head>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonLd({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: data.member.Displayname,
      alternateName: data.member.Username,
      description: data.member.CustomData?.description,
      image: data.member.Image,
      sameAs: [
        data.member.CustomData?.nexusmods && `${PUBLIC_NEXUS_PROFILE_URL}/${data.member.CustomData?.nexusmods}`,
        data.member.CustomData?.github && `https://github.com/${data.member.CustomData?.github}`,
      ].filter((v) => v),
    },
  })}
</svelte:head>

<PageRoot
  title={[data.member.Displayname, "Member detail"]}
  description={data.member.CustomData?.description || "Member of the RedModding community"}
  hideDescription
>
  {#await data}
    <Loading />
  {:then data}
    <header class="relative w-full max-w-screen-lg pt-16 text-left max-md:mt-4" class:text-shadow={background}>
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

      <div class="mb-8 inline-flex flex-wrap gap-4 px-2">
        <div class="fade-in flex-shrink-0" style:--fade-delay=".7s">
          <Image src={data.member.Image} width={128} height={128} />
        </div>

        <div class="flex max-w-full flex-grow flex-col justify-around gap-2">
          <div class="fade-in">
            <Heading level={2} class="small-caps m-0 normal-case leading-none text-white">
              {data.member.Nickname || data.member.Displayname}
            </Heading>

            {#if data.member.Nickname}
              <p class="small-caps -mt-1 text-xl text-zinc-300">{data.member.Displayname}</p>
            {/if}
          </div>

          {#if data.member.CustomData?.description}
            <p class="fade-in max-w-screen-sm" style:--fade-delay=".3s">
              {data.member.CustomData.description}
            </p>
          {/if}
        </div>
      </div>

      <div class="fade-in mb-16 ml-8 max-md:text-center md:float-right" style:--fade-delay="1.2s">
        <Heading level={3} class="mb-2">Teams</Heading>

        <ul class="inline-flex flex-col gap-2">
          {#each data.member.Teams as teamId, i (teamId)}
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
        class="fade-in clear-left my-8 flex flex-wrap justify-around gap-x-6 gap-y-4 px-4 text-center"
        style:--fade-delay="1s"
      >
        {#if data.nexus?.user.country}
          <DataEntry key="Country">{data.nexus.user.country}</DataEntry>
        {/if}

        {#if data.nexus?.user.kudos}
          <DataEntry key="Kudos">{data.nexus.user.kudos.toLocaleString()}</DataEntry>
        {/if}

        {#if data.nexus?.["user-mods-count"].mods.totalCount}
          <DataEntry key="Mods released">{data.nexus?.["user-mods-count"].mods.totalCount.toLocaleString()}</DataEntry>
        {/if}

        {#if data.nexus?.user.uniqueModDownloads}
          <DataEntry key="Unique mod downloads">{data.nexus.user.uniqueModDownloads.toLocaleString()}</DataEntry>
        {/if}

        {#if data.member.CustomData?.github}
          <DataEntry key="GitHub">
            <Button inline hideExternal href="https://github.com/{data.member.CustomData?.github}" class="text-lg">
              @{data.member.CustomData?.github}
            </Button>
          </DataEntry>
        {/if}

        {#if data.member.CustomData?.nexusmods}
          <DataEntry key="NexusMods">
            <Button
              inline
              hideExternal
              href="{PUBLIC_NEXUS_PROFILE_URL}/{data.member.CustomData?.nexusmods}"
              class="text-lg"
            >
              @{data.member.CustomData?.nexusmods}
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

      {#if data.contributions?.length}
        <Section as="section" class="fade-in m-0">
          <Heading level={2}>Project contributions</Heading>

          <ul class="flex flex-wrap justify-center gap-2">
            {#each data.contributions as contribution}
              {@const project = projects[contribution.projectId]}
              <li>
                <Card title={project.name} href="https://github.com/{contribution.full_name}">
                  <Image slot="logo" src={project.image} width={385} height={216} />
                  {project.description}
                </Card>
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
  }
</style>
