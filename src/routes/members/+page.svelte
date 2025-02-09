<script lang="ts">
  import Divider from "$components/elements/Divider.svelte";
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
    <small class="mt-2 block text-zinc-400">
      More info about this list is on <a href="#wtf" class="hover-focus:text-zinc-200 underline">the bottom</a>.
    </small>
  {/snippet}

  {#each Object.entries(data.teamMembers) as [teamId, members], i (teamId)}
    {@const team = teams[teamId]}
    {#if i}<Divider class="m-0" />{/if}

    <TeamSection {teamId} {team}>
      {#each members as member, j (member.ID)}
        <MemberItem {member} {team} fadeInDelay={j * 0.05} />
      {/each}
    </TeamSection>
  {/each}

  <Divider class="m-0 -mb-8" />

  <div id="wtf" class="max-w-4xl space-y-2 text-center leading-[1.2]">
    <p>
      Members here are categorized by the highest team role they have on Discord, or by their chosen <em
        >primary team</em
      >. Displayed name is Discord username by default.<br />
    </p>
    <p>
      Use LizzyFuzzy bot's <code>/link</code> command to modify your profile, changes should appear within 24 hours.
    </p>
    <p>If you wish to change your primary team, name or something else not available in Lizzy, ping @Zhincore.</p>

    <small class="mt-6 block leading-[1.2] text-zinc-200">
      *: The "{teams.leaders.label}" team is made up by Zhincore and does not represent an actual hierarchy.<br />
      If you're annoyed with it, again, ping @Zhincore. Fuzzo has nothing to do with this.
    </small>
  </div>
</PageRoot>
