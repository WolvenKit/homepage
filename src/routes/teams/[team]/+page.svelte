<script lang="ts">
  import { page } from "$app/state";
  import Button from "$components/elements/Button.svelte";
  import PageRoot from "$components/parts/PageRoot.svelte";
  import { teams } from "$lib/content/teams.js";
  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
  import MemberItem from "../../members/MemberItem.svelte";
  import TeamSection from "../../members/TeamSection.svelte";
  import Heading from "$lib/components/elements/Heading.svelte";
  import TeamBadge from "../../members/TeamBadge.svelte";

  let { data } = $props();

  const teamId = $derived(page.params.team);
  const team = $derived(teams[teamId]);
</script>

<PageRoot hideHeader title={[team.label, "Team"]} description={team.description}>
  <header
    class="relative flex w-full max-w-(--breakpoint-lg) flex-col items-center justify-center text-center max-md:mt-4"
  >
    <Button href="." icon={faArrowLeft} class="text-cyan/75 absolute bottom-full left-0 md:top-0 "
      >See all members</Button
    >

    <Heading level={2} class="mb-4 flex flex-wrap items-center justify-center gap-4 font-bold">
      <TeamBadge {teamId} {team} class="size-10" />
      {team.label}
    </Heading>

    {#if team.description}
      <p class="text-xl">
        {team.description}
      </p>
    {/if}

    <p class="mt-2 text-zinc-300">
      This page shows all members with the {team.label} badge.
      <small class="-mt-1 block">Their primary team might be different.</small>
    </p>
  </header>

  <ul class="flex w-full max-w-(--breakpoint-2xl) flex-wrap justify-center gap-4">
    {#each data.members as member, j (member.ID)}
      <MemberItem {member} {team} fadeInDelay={j * 0.05} />
    {/each}
  </ul>
</PageRoot>
