<script lang="ts">
  import { faExternalLink } from "@fortawesome/free-solid-svg-icons/faExternalLink";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import type { Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { outlineToPath, scalePath, THEME_CLASSES, THEME_CORNERS, type Theme } from "$lib/themes";
  import { tw } from "$lib/utils";
  import ThemeCorner from "./ThemeCorner.svelte";
  import WitcherFrame from "./WitcherFrame.svelte";

  interface Props {
    theme?: Theme;
    size?: keyof typeof SIZES;
    hideExternal?: boolean;
    leftmost?: boolean;
    href?: string;
    external?: boolean;
    label?: string;
    cornerClass?: string;
    class?: string;
    children?: Snippet;
    onClick?: () => void;
  }

  let {
    theme = "default",
    size = "lg",
    hideExternal = false,
    leftmost = true,
    href = "",
    external = !!href && ![".", "/"].includes(href[0]),
    label = "",
    cornerClass = "",
    class: classes = "",
    children,
    onClick,
  }: Props = $props();

  const SIZES = {
    lg: tw`px-6 py-2 text-xl`,
    sm: tw`px-4 py-1.5 leading-none`,
  };

  const THEME: Record<Theme, string> = {
    default: "",
    cyberpunk: tw`hover-focus:bg-cyan-darker bg-gray-950`,
    witcher: tw`hover-focus:bg-zinc-600`,
  };

  let cornerScale = $derived(size == "sm" ? 0.5 : 1);
  let corner = $derived(leftmost && theme == "cyberpunk" ? THEME_CORNERS.cyberpunk : undefined);
  let clipPath = $derived(
    corner ? outlineToPath(scalePath(THEME_CORNERS.cyberpunk!.outline, cornerScale - 0.05), { tl: true }) : undefined,
  );
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
  this={href ? "a" : "button"}
  onclick={onClick}
  {href}
  rel={external ? "noopener noreferrer" : undefined}
  target={external ? "_blank" : undefined}
  title={label || undefined}
  class={twMerge(
    "relative inline-block border-2 text-center font-semibold uppercase",
    "hover-focus:bg-zinc-700 hover-focus:text-white transition",
    THEME_CLASSES[theme ?? "default"].border.border,
    SIZES[size],
    THEME[theme],
    theme == "witcher" && size != "sm" && "border-transparent",
    classes,
  )}
  style:clip-path={clipPath}
>
  {#if theme == "cyberpunk"}
    <ThemeCorner
      class={twMerge("absolute -top-0.5 -left-0.5", THEME_CLASSES[theme ?? "default"].border.text, cornerClass)}
      theme="cyberpunk"
      scale={cornerScale}
    />
  {:else if theme == "witcher" && size != "sm"}
    <WitcherFrame class="-inset-px" />
  {/if}
  {#if children}{@render children()}{:else}{label}{/if}
  {#if external && !hideExternal}
    <FontAwesomeIcon icon={faExternalLink} class="relative -top-0.5 text-sm opacity-50" />
  {/if}
</svelte:element>
