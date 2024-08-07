<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Divider from "$components/elements/Divider.svelte";
  import Heading from "$components/elements/Heading.svelte";
  import Section from "$components/parts/Section.svelte";
  import Loading from "$lib/components/parts/Loading.svelte";
  import { teams } from "$lib/content/teams";
  import MemberItem from "./MemberItem.svelte";
  import TeamSection from "./TeamSection.svelte";

  export let data;

  // Render only portions of the teams to prevent lag
  let limit = -1;

  onMount(() => {
    if (data.teamMembers instanceof Promise) {
      limit = 0;
      data.teamMembers.then((teams) => {
        let maxLimit = Object.keys(teams).length;

        function updateLimit() {
          limit += 1;
          if (limit < maxLimit) window.requestAnimationFrame(updateLimit);
        }
        updateLimit();
      });
    }
  });
</script>

<Section>
  <Heading>Our Members</Heading>

  <p class="max-w-3xl text-center">
    Here are the members of our Red Modding team.<br />
    This includes people who <code class="text-sm">[INSERT_REQUIREMENT_LIST_HERE]</code>, etc.<br />
    If you want to join our team you have to contribute to... idk what to write here, someone help me.
  </p>

  {#await data.teamMembers}
    <Loading />
  {:then teamMembers}
    {#each Object.entries(teamMembers).slice(0, limit) as [teamId, members], i (teamId)}
      {@const team = teams[teamId]}
      {#if i}<Divider class="m-0" />{/if}

      <TeamSection {team}>
        {#each members as member (member.ID)}
          <MemberItem {member} {team} />
        {/each}
      </TeamSection>
    {/each}

    <Divider class="m-0 -mb-8" />
    <p class="max-w-3xl text-center">
      Members are by default categorized by the highest team role they have on Discord. Use LizzyFuzzy bot's
      <code>/link</code> command to modify your profile. Displayed name is taken from NexusMods or GitHub or generated from
      Discord username. If you wish to change your primary team, name or something else, ping @Zhincore.
    </p>
  {/await}
</Section>
