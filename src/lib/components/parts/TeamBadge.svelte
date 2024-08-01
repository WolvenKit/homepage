<script lang="ts" context="module">
  export type Team = "admin" | "wiki" | "CET" | "WolvenKit" | "REDcore" | "Website";
</script>

<script lang="ts">
  import catMod from "$assets/catmod.webp";
  import Image from "$components/elements/Image.svelte";

  const COLORS = {
    REDcore: "#ff0000",
    Website: "#7119f8",
    wiki: "#00d7fd",
    WolvenKit: "#ff4c6f",
    CET: "#005bf9",
  } satisfies Record<Exclude<Team, "admin">, string>;

  export let team: Team;
  let classes = "";
  export { classes as class };
</script>

{#if team == "admin"}
  <Image src={catMod} width={24} height={24} alt={team} title={team} class={classes} />
{:else}
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    width="24"
    height="24"
    class={classes}
    style:color={COLORS[team]}
  >
    <title>{team}</title>

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
