<script lang="ts">
  import type { Snippet } from "svelte";
  import Heading from "$components/elements/Heading.svelte";
  import type { Team } from "$lib/content/teams";
  import TeamBadge from "./TeamBadge.svelte";

  interface Props {
    team: Team;
    children?: Snippet;
    onClick?: () => void;
  }

  let { team, children, onClick }: Props = $props();
</script>

<Heading level={2} class="-mb-4 mt-0 flex flex-wrap items-center justify-center gap-2">
  <TeamBadge {team} class="size-10" {onClick} />
  {team.label}
</Heading>

{#if team.description}
  <p class="-my-8 text-zinc-400">{team.description}</p>
{/if}

<ul class="flex w-full max-w-screen-2xl flex-wrap justify-center gap-4">
  {@render children?.()}
</ul>
