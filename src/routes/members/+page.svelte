<script lang="ts">
  import Divider from "$components/elements/Divider.svelte";
  import ErrorAlert from "$components/parts/ErrorAlert.svelte";
  import Loading from "$components/parts/Loading.svelte";
  import PageRoot from "$components/parts/PageRoot.svelte";
  import { teams } from "$lib/content/teams";
  import MemberItem from "./MemberItem.svelte";
  import TeamSection from "./TeamSection.svelte";

  let { data } = $props();
</script>

<PageRoot title="Our Members" description="Members of our Red Modding community.">
  {#snippet descriptionEl()}
    Meet the members of our Red Modding community.<br />
    This includes people who have contributed to our projects, collaborated on mods, and supported our goals.<br />
    If you want to join our team, just show us your passion and contribute to our ongoing efforts!
  {/snippet}

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
      Members are by default categorized by the highest team role they have on Discord. Displayed name is Discord
      username.<br />
      Use LizzyFuzzy bot's <code>/link</code> command to modify your profile, changes should appear within 24 hours. If you
      wish to change your primary team, name or something else, ping @Zhincore.
    </p>
  {:catch error}
    <ErrorAlert {error} />
  {/await}
</PageRoot>
