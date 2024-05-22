<script lang="ts">
  import type { IconDefinition } from "@fortawesome/fontawesome-common-types";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";

  export let href = "";
  export let external = !href.startsWith("/");
  export let icon: IconDefinition | undefined = undefined;
  export let element: HTMLElement | undefined = undefined;
</script>

<svelte:element
  this={href ? "a" : "button"}
  bind:this={element}
  {href}
  rel={external ? "noopener noreferrer" : undefined}
  target={external ? "_blank" : undefined}
  class={twMerge(
    "hover-glow relative inline-flex items-center justify-center gap-3 px-4 py-2 text-center text-xl font-bold uppercase text-cyan",
    "transition hover:text-white",
  )}
>
  {#if icon}<FontAwesomeIcon {icon} class="-ml-2" />{/if}
  <slot />
</svelte:element>
