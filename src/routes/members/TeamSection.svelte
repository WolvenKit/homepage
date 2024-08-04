<script lang="ts">
  import Heading from "$components/elements/Heading.svelte";
  import type { Team } from "$lib/content/teams";
  import TeamBadge from "./TeamBadge.svelte";

  export let team: Team;
</script>

<Heading level={2} class="flex flex-wrap items-center justify-center gap-2">
  <TeamBadge {team} class="size-10" />
  {team.label}
</Heading>

{#if team.description}
  <p class="-my-8 text-zinc-400">{team.description}</p>
{/if}

<ul class="flex w-full max-w-screen-2xl flex-wrap justify-center gap-4">
  <slot></slot>
</ul>
