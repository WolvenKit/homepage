<script lang="ts">
  import type { IconDefinition } from "@fortawesome/fontawesome-common-types";
  import { faExternalLink } from "@fortawesome/free-solid-svg-icons/faExternalLink";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";

  export let inline = false;
  export let href = "";
  export let external = ![".", "/"].includes(href[0]);
  export let icon: IconDefinition | undefined = undefined;
  export let element: HTMLElement | undefined = undefined;
  export let iconOnly = false;
  export let label = "";
  export let hideExternal = false;
  let classes = "";
  export { classes as class };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
  this={href ? "a" : "button"}
  on:click
  bind:this={element}
  {href}
  rel={external ? "noopener noreferrer" : undefined}
  target={external ? "_blank" : undefined}
  title={label || undefined}
  class={twMerge(
    "hover-glow relative inline-flex items-center justify-center gap-3 text-center font-bold uppercase text-cyan",
    "transition hover:text-white",
    !inline && "px-4 py-2 text-xl",
    iconOnly && "p-2",
    classes,
  )}
>
  {#if icon}<FontAwesomeIcon {icon} class="-ml-2" />{/if}
  {#if iconOnly}<span class="sr-only"><slot>{label}</slot></span>{:else}<slot>{label}</slot>{/if}
  {#if external && !hideExternal}<FontAwesomeIcon icon={faExternalLink} class="-ml-1 -mt-1 text-sm opacity-50" />{/if}
</svelte:element>
