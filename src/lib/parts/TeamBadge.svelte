<script lang="ts" context="module">
  export type Team = "admin" | "wiki" | "CET" | "WolvenKit" | "REDcore" | "Website";
</script>

<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import catMod from "$assets/catmod.webp";
  import Image from "$lib/elements/Image.svelte";

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
  <Image src={catMod} width={24} height={24} class={twMerge("stroke-[64]", classes)} />
{:else}
  <svg
    version="1.1"
    viewBox="0 0 1024 1024"
    width={24}
    height={24}
    xmlns="http://www.w3.org/2000/svg"
    class={twMerge("stroke-[64]", classes)}
  >
    <title>{team}</title>
    <path d="m937.1 761-425.1 249-425.1-249 .0052-498 425.1-249 425.1 249z" class="fill-black" />
    <path d="m870 722.4-358.6 209.4-358-210.4.593-419.8 358.6-209.4 358 210.4z" class="fill-none stroke-white" />
    <path d="m512.6 92.17-.5931 419.8 358 210.4" class="fill-none stroke-white" />
    <path d="m153.4 721.4 358.6-209.4" class="fill-none stroke-white" />
    <circle cx="512" cy="512" r="199.4" fill={COLORS[team]} />
  </svg>
{/if}
