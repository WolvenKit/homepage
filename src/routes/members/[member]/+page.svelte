<script lang="ts">
  import Heading from "$lib/components/elements/Heading.svelte";
  import Image from "$lib/components/elements/Image.svelte";
  import Section from "$lib/components/parts/Section.svelte";
  import { teams } from "$lib/content/teams";
  import TeamBadge from "../TeamBadge.svelte";

  export let data;
</script>

<Section>
  <Heading>Member detail</Heading>

  <div class="flex w-full max-w-screen-lg flex-wrap gap-8">
    <div>
      <Image src={data.member.Image} width={128} height={128} />
    </div>

    <div class="flex flex-grow flex-col gap-4">
      <Heading level={2} class="text-white">{data.member.Displayname}</Heading>
      {#if data.member.CustomData?.description}
        <p>{data.member.CustomData.description}</p>
      {/if}

      <dl>
        <!-- {#if data.nexus?.user.country}
          <dt>Country</dt>
          <dd>{data.nexus.user.country}</dd>
        {/if}

        {#if data.nexus?.user.kudos}
          <dt>Kudos</dt>
          <dd>{data.nexus.user.kudos}</dd>
        {/if} -->
      </dl>
    </div>

    <div>
      <Heading level={3}>Teams</Heading>

      <ul class="flex flex-col gap-2">
        {#each data.member.Teams as teamId (teamId)}
          {@const team = teams[teamId]}
          <li class="flex items-center gap-2 text-xl font-semibold leading-none text-zinc-400">
            <TeamBadge {team} />
            {team.label}
          </li>
        {/each}
      </ul>
    </div>
  </div>
</Section>
