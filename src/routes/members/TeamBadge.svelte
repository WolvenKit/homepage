<script lang="ts">
  import Image from "$components/elements/Image.svelte";
  import { teams, type Team } from "$lib/content/teams";

  export let team: Team | string;
  let classes = "";
  export { classes as class };

  $: teamInfo = typeof team === "string" ? teams[team] : team;
</script>

{#if "icon" in teamInfo && teamInfo.icon}
  <Image src={teamInfo.icon} width="24" height="24" class={classes} title={teamInfo.label} />
{:else if "color" in teamInfo && teamInfo.color}
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    width="24"
    height="24"
    class={classes}
    style:color={teamInfo.color}
  >
    <title>{teamInfo.label}</title>
    <path d="m937.1 761-425.1 249-425.1-249 .0052-498 425.1-249 425.1 249z" fill="black" stroke="white" />
    <path
      d="m870 722.4-358.6 209.4-358-210.4.593-419.8 358.6-209.4 358 210.4z"
      fill="none"
      stroke="white"
      stroke-width="64"
    />
    <path d="m512.6 92.17-.5931 419.8 358 210.4" fill="none" stroke="white" stroke-width="64" />
    <path d="m153.4 721.4 358.6-209.4" fill="none" stroke="white" stroke-width="64" />
    <circle cx="512" cy="512" r="199.4" fill="currentColor" stroke="none" />
  </svg>
{/if}
