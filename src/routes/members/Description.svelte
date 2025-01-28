<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import borpaSpin from "$assets/borpa_spin.webp";
  import LazyImage from "$lib/components/elements/LazyImage.svelte";

  interface Props {
    text: string;
    class?: string;
    longClass?: string;
  }

  const { text, class: classes = "", longClass }: Props = $props();

  const REPLACEMENTS = new RegExp(["borpaspin"].map((v) => `(?=${v})|(?<=${v})`).join("|"));

  const trunc = $derived(text.slice(0, 1024));
  const split = $derived(trunc.split(REPLACEMENTS, 4));
</script>

<p class={twMerge(classes, text.length > 128 && "text-xs", text.length > 64 && longClass)}>
  {#each split as chunk, i (i + chunk)}{#if chunk == "borpaspin"}
      <LazyImage src={borpaSpin} class="inline size-4" />
    {:else}{chunk}{/if}{/each}
</p>
