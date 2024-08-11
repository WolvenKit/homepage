<script lang="ts">
  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
  import Button from "$components/elements/Button.svelte";
  import Heading from "$components/elements/Heading.svelte";
  import Image from "$components/elements/Image.svelte";
  import Card from "$components/parts/Card.svelte";
  import ErrorAlert from "$components/parts/ErrorAlert.svelte";
  import Loading from "$components/parts/Loading.svelte";
  import Section from "$components/parts/Section.svelte";
  import { PUBLIC_NEXUS_PROFILE_URL } from "$env/static/public";
  import { projects } from "$lib/content/projects";
  import { teams } from "$lib/content/teams";
  import TeamBadge from "../TeamBadge.svelte";
  import DataEntry from "./DataEntry.svelte";

  export let data;
</script>

<Section>
  <Heading>Member detail</Heading>

  {#await data}
    <Loading />
  {:then data}
    <header class="relative w-full max-w-screen-lg text-left max-md:mt-4">
      <Button href="." icon={faArrowLeft} class="absolute bottom-full text-opacity-75 md:mb-4">See all members</Button>

      <div class="mb-4 inline-flex flex-wrap gap-4 px-2">
        <div class="flex-shrink-0">
          <Image src={data.member.Image} width={128} height={128} />
        </div>

        <div class="flex max-w-full flex-grow flex-col justify-around gap-2">
          <div>
            <Heading level={2} class="small-caps m-0 normal-case leading-none text-white">
              {data.member.Nickname || data.member.Displayname}
            </Heading>

            {#if data.member.Nickname}
              <p class="small-caps -mt-1 text-xl text-zinc-300">{data.member.Displayname}</p>
            {/if}
          </div>

          {#if data.member.CustomData?.description}
            <p class="max-w-screen-sm">{data.member.CustomData.description}</p>
          {/if}
        </div>
      </div>

      <div class="mb-8 ml-8 max-md:text-center md:float-right">
        <Heading level={3} class="mb-2">Teams</Heading>

        <ul class="inline-flex flex-col gap-2">
          {#each data.member.Teams as teamId (teamId)}
            {@const team = teams[teamId]}
            <li class="flex items-center gap-2 text-xl font-semibold leading-none text-zinc-400">
              <TeamBadge {team} />
              {team.label}
            </li>
          {/each}
        </ul>
      </div>

      <dl class="clear-left my-4 flex flex-wrap justify-around gap-x-6 gap-y-4 px-4 text-center">
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
              href="{PUBLIC_NEXUS_PROFILE_URL}/{data.member.CustomData?.github}"
              class="text-lg"
            >
              @{data.member.CustomData?.nexusmods}
            </Button>
          </DataEntry>
        {/if}
      </dl>
    </header>

    {#if data.nexus?.mods.length}
      <Section as="section" class="m-0">
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
      <Section as="section" class="m-0">
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
  {:catch error}
    <ErrorAlert {error} />
  {/await}
</Section>
