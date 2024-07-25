<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import Heading from "$lib/elements/Heading.svelte";
  import TeamBadge, { type Team } from "$lib/parts/TeamBadge.svelte";

  export let team: Team | undefined = undefined;
  export let title: string = `Team ${team}`;
  export let description = "";
</script>

<Heading level={2} class="flex flex-wrap items-center justify-center gap-2">
  {#if team}<TeamBadge {team} class="size-10" />{/if}
  {title}
</Heading>

{#if description}
  <p class="-my-8 text-zinc-400">{description}</p>
{/if}

<ul
  class={twMerge(
    "grid w-full max-w-screen-2xl justify-center gap-4",
    "2xl:grid-cols-[repeat(auto-fit,minmax(20%,auto))]",
    "lg:grid-cols-[repeat(auto-fit,minmax(30%,auto))]",
    "sm:grid-cols-[repeat(auto-fit,minmax(35%,auto))]",
    "grid-cols-[repeat(auto-fit,minmax(50%,auto))]",
  )}
>
  <!-- <ul class="flex max-w-screen-2xl flex-wrap justify-center gap-4"> -->
  <slot></slot>
</ul>
