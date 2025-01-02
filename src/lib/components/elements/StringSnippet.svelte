<script lang="ts">
  import type { Snippet } from "svelte";
  import { isFn } from "$lib/utils";

  interface Props {
    children?: string | Snippet;
  }

  const { children }: Props = $props();
</script>

{#if isFn(children)}{@render children()}{:else}{children}{/if}
