<script lang="ts">
  import type { IconDefinition } from "@fortawesome/fontawesome-common-types";
  import { faExternalLink } from "@fortawesome/free-solid-svg-icons/faExternalLink";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import type { Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";

  interface Props {
    inline?: boolean;
    href?: string;
    external?: boolean;
    icon?: IconDefinition | undefined;
    element?: HTMLElement | undefined;
    iconOnly?: boolean;
    label?: string;
    hideExternal?: boolean;
    class?: string;
    children?: Snippet;
    onClick?: () => void;
  }

  let {
    inline = false,
    href = "",
    external = !!href && ![".", "/"].includes(href[0]),
    icon = undefined,
    element = $bindable(undefined),
    iconOnly = false,
    label = "",
    hideExternal = false,
    class: classes = "",
    children,
    onClick,
  }: Props = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
  this={href ? "a" : "button"}
  onclick={onClick}
  bind:this={element}
  {href}
  rel={external ? "noopener noreferrer" : undefined}
  target={external ? "_blank" : undefined}
  title={label || undefined}
  class={twMerge(
    "hover-glow relative inline-flex items-center justify-center gap-3 text-center font-bold uppercase leading-none text-cyan",
    "transition hover-focus:text-white",
    !inline && "px-4 py-2 text-xl",
    iconOnly && "p-2",
    classes,
  )}
>
  {#if icon}<FontAwesomeIcon {icon} class="-ml-2" />{/if}
  {#if iconOnly}<span class="sr-only"
      >{#if children}{@render children()}{:else}{label}{/if}</span
    >{:else if children}{@render children()}{:else}{label}{/if}
  {#if external && !hideExternal}<FontAwesomeIcon icon={faExternalLink} class="-ml-1 -mt-1 text-sm opacity-50" />{/if}
</svelte:element>
