<script lang="ts">
  import { onMount } from "svelte";
  import { getCyberspace } from "./Cyberspace.svelte";

  const cyberspace = getCyberspace();

  let self: HTMLElement;

  onMount(() => cyberspace?.registerEntity(self));
</script>

<div bind:this={self} class="mt-64 h-16 w-96 border border-[cyan]">
  <slot />
</div>
