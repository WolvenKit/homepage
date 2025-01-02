<script lang="ts">
  import LazyImage from "$components/elements/LazyImage.svelte";
  import { teams, type Team } from "$lib/content/teams";

  interface Props {
    team: Team | string;
    class?: string;
    onClick?: () => void;
  }

  let { team, class: classes = "", onClick }: Props = $props();

  let teamInfo = $derived(typeof team === "string" ? teams[team] : team);
</script>

{#if "icon" in teamInfo && teamInfo.icon}
  <LazyImage src={teamInfo.icon} width="24" height="24" class={classes} title={teamInfo.label} />
{:else if "color" in teamInfo && teamInfo.color}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    width="24"
    height="24"
    class={classes}
    style:color={teamInfo.color}
    onclick={onClick}
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
