<script lang="ts">
  import type { Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { outlineToPath, THEME_CLASSES, THEME_CORNERS, type Theme } from "$lib/themes";
  import type { Corner } from "$lib/utils";
  import ThemeCorner from "./ThemeCorner.svelte";

  interface Props {
    scale?: number;
    theme?: Theme;
    corners?: Partial<Record<Corner, boolean>>;
    class?: string;
    children?: Snippet;
  }

  let {
    scale = 1,
    theme = "default",
    corners = theme == "cyberpunk" ? { tr: true, bl: true } : { tl: true, tr: true, bl: true, br: true },
    class: classes = "",
    children,
  }: Props = $props();

  let clipPath = $derived(
    children && THEME_CORNERS[theme] ? outlineToPath(THEME_CORNERS[theme]!.outline, corners) : undefined,
  );
</script>

<div
  class={twMerge(
    "relative border-2 border-current",
    !children && "pointer-events-none absolute inset-0 p-1",
    THEME_CLASSES[theme ?? "default"].border.text,
    classes,
  )}
  style:clip-path={clipPath}
>
  {@render children?.()}

  {#if theme != "default"}
    {#if corners.tl}
      <ThemeCorner {theme} {scale} class="absolute -top-0.5 -left-0.5" />
    {/if}
    {#if corners.tr}
      <ThemeCorner {theme} {scale} class="absolute -top-0.5 -right-0.5 rotate-90" />
    {/if}
    {#if corners.br}
      <ThemeCorner {theme} {scale} class="absolute -right-0.5 -bottom-0.5 rotate-180" />
    {/if}
    {#if corners.bl}
      <ThemeCorner {theme} {scale} class="absolute -bottom-0.5 -left-0.5 -rotate-90" />
    {/if}
  {/if}
</div>
