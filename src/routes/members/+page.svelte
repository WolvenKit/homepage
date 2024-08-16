<script lang="ts">
  import Divider from "$components/elements/Divider.svelte";
  import ErrorAlert from "$components/parts/ErrorAlert.svelte";
  import Loading from "$components/parts/Loading.svelte";
  import PageRoot from "$components/parts/PageRoot.svelte";
  import { teams } from "$lib/content/teams";
  import MemberItem from "./MemberItem.svelte";
  import TeamSection from "./TeamSection.svelte";

  export let data;
</script>

<PageRoot title="Our Members" description="List of member of our Red Modding community.">
  <svelte:fragment slot="description">
    Here are the members of our Red Modding community.<br />
    This includes people who <code class="text-sm">[INSERT_REQUIREMENT_LIST_HERE]</code>, etc.<br />
    If you want to join our team you have to contribute to... idk what to write here, someone help me.
  </svelte:fragment>

  {#await data.teamMembers}
    <Loading />
  {:then teamMembers}
    {#each Object.entries(teamMembers) as [teamId, members], i (teamId)}
      {@const team = teams[teamId]}
      {#if i}<Divider class="m-0" />{/if}

      <TeamSection {team}>
        {#each members as member, j (member.ID)}
          <MemberItem {member} {team} fadeInDelay={j * 0.05} />
        {/each}
      </TeamSection>
    {/each}

    <Divider class="m-0 -mb-8" />
    <p class="max-w-3xl text-center">
      Members are by default categorized by the highest team role they have on Discord. Use LizzyFuzzy bot's
      <code>/link</code> command to modify your profile. Displayed name is taken from NexusMods or GitHub or generated from
      Discord username. If you wish to change your primary team, name or something else, ping @Zhincore.
    </p>
  {:catch error}
    <ErrorAlert {error} />
  {/await}
</PageRoot>
