<script lang="ts">
  import type { IconDefinition } from "@fortawesome/fontawesome-common-types";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

  export let slant = 16;
  export let href = "";
  export let icon: IconDefinition | undefined = undefined;
  export let element: HTMLElement | undefined = undefined;
</script>

<svelte:element
  this={href ? "a" : "button"}
  bind:this={element}
  {href}
  class="panel inline-flex items-center justify-center gap-4 bg-cyan-darker px-4 py-2 text-center text-xl font-bold uppercase text-cyan transition hover:bg-cyan-dark hover:text-white"
  style:--slant="{slant}px"
>
  {#if icon}<FontAwesomeIcon {icon} class="-ml-2" />{/if}
  <slot />
</svelte:element>

<style>
  .panel {
    --offset: calc(100% - var(--slant));
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, var(--slant) 100%, 0% var(--offset));
    padding-left: calc(var(--slant) + 0.5rem);
  }
</style>
