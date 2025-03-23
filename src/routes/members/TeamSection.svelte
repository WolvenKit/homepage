<script lang="ts">
  import type { Snippet } from "svelte";
  import Heading from "$components/elements/Heading.svelte";
  import type { Team } from "$lib/content/teams";
  import TeamBadge from "./TeamBadge.svelte";
  import Button from "$lib/components/elements/Button.svelte";

  interface Props {
    teamId: string;
    team: Team;
    children?: Snippet;
  }

  let { teamId, team, children }: Props = $props();
</script>

<Heading level={2} class="mt-0 -mb-4 ">
  <a
    href="/teams/{teamId}"
    class="hover-focus:text-white hover-focus:underline flex flex-wrap items-center justify-center gap-2 transition"
  >
    <TeamBadge {teamId} {team} class="size-10" />
    {team.label}
  </a>
</Heading>

{#if team.description}
  <p class="-my-8 text-zinc-400">{team.description}</p>
{/if}

<ul class="flex w-full max-w-(--breakpoint-2xl) flex-wrap justify-center gap-4">
  {@render children?.()}
</ul>

<Button href="/teams/{teamId}" class="text-cyan/75 -mt-12">See all members in this team</Button>
