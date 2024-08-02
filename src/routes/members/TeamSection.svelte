<script lang="ts">
  import { twMerge } from "tailwind-merge";
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

<ul
  class={twMerge(
    "grid w-full max-w-screen-2xl justify-center gap-4",
    "2xl:grid-cols-[repeat(auto-fit,minmax(20%,auto))]",
    "lg:grid-cols-[repeat(auto-fit,minmax(30%,auto))]",
    "sm:grid-cols-[repeat(auto-fit,minmax(35%,auto))]",
    "grid-cols-[repeat(auto-fit,minmax(50%,100%))]",
  )}
>
  <!-- <ul class="flex max-w-screen-2xl flex-wrap justify-center gap-4"> -->
  <slot></slot>
</ul>
