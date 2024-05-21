<script lang="ts">
  import { onMount } from "svelte";

  let self: HTMLElement;
</script>

<div bind:this={self} class="mt-64 h-16 w-96 border border-[cyan]">
  <slot />
</div>
