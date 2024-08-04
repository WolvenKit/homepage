<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { outlineToPath, scalePath, THEME_COLORS, THEME_CORNERS, type Theme } from "$lib/themes";
  import { tw } from "$lib/utils";
  import ThemeCorner from "./ThemeCorner.svelte";

  export let theme: Theme = "default";
  export let size: keyof typeof SIZES = "lg";
  export let leftmost = true;
  export let href = "";
  export let external = !href.startsWith("/");
  export let label = "";
  let classes = "";
  export { classes as class };

  const SIZES = {
    lg: tw`px-4 py-2`,
    sm: tw`px-3 py-1`,
  };

  const THEME: Record<Theme, string> = {
    default: "",
    cyberpunk: tw`bg-red-darkest hover-focus:bg-red-darker`,
    witcher: tw``,
  };

  $: cornerScale = size == "sm" ? 0.5 : 1;
  $: corner = leftmost && theme == "cyberpunk" ? THEME_CORNERS.cyberpunk : undefined;
  $: clipPath = corner
    ? outlineToPath(scalePath(THEME_CORNERS.cyberpunk!.outline, cornerScale - 0.05), { tl: true })
    : undefined;
</script>

<svelte:element
  this={href ? "a" : "button"}
  {href}
  rel={external ? "noopener noreferrer" : undefined}
  target={external ? "_blank" : undefined}
  title={label || undefined}
  class={twMerge(
    "relative border-2 text-center font-semibold uppercase leading-none",
    "transition hover-focus:bg-zinc-700 hover-focus:text-white",
    THEME_COLORS[theme ?? "default"].border.border,
    SIZES[size],
    THEME[theme],
    classes,
  )}
  style:clip-path={clipPath}
>
  {#if theme == "cyberpunk"}
    <ThemeCorner
      class={twMerge("absolute -left-0.5 -top-0.5 -translate-y-px", THEME_COLORS[theme ?? "default"].border.text)}
      theme="cyberpunk"
      scale={cornerScale}
    />
  {/if}

  <slot>{label}</slot>
</svelte:element>
