<script lang="ts" context="module">
  import type { Team } from "$lib/parts/TeamBadge.svelte";

  export interface Member {
    name: string;
    bio: string;
    image: string;
    teams: Team[];
    theme?: Theme;
  }
</script>

<script lang="ts">
  import Image from "$lib/elements/Image.svelte";
  import TeamBadge from "$lib/parts/TeamBadge.svelte";
  import type { Theme } from "$lib/themes";

  export let member: Member;
</script>

<li class="flex">
  <Image src={member.image} width={96} height={96} class="size-24 flex-shrink-0 object-cover" />

  <div class="px-4">
    <h3 class="mb-1 flex flex-wrap items-center gap-x-2">
      <span class="text-2xl leading-none">{member.name}</span>
      {#if member.teams.length}
        <ul class="flex flex-wrap gap-px">
          {#each member.teams as team (team)}
            <li><TeamBadge {team} /></li>
          {/each}
        </ul>
      {/if}
    </h3>

    <p class="leading-tight text-zinc-300">{member.bio}</p>
  </div>
</li>
