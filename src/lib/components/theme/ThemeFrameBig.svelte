<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { THEME_COLORS, type Theme } from "$lib/themes";
  import type { Corner } from "$lib/utils";
  import ThemeCorner from "./ThemeCorner.svelte";

  export let theme: Theme = "default";
  export let corners: Partial<Record<Corner, boolean>> =
    theme == "cyberpunk" ? { tr: true, bl: true } : { tl: true, tr: true, bl: true, br: true };
  let classes = "";
  export { classes as class };
</script>

<div
  class={twMerge(
    "pointer-events-none absolute inset-0 border-2 border-current p-1",
    THEME_COLORS[theme ?? "default"].border.text,
    classes,
  )}
>
  {#if theme != "default"}
    {#if corners.tl}
      <ThemeCorner {theme} class="absolute -left-0.5 -top-0.5" />
    {/if}
    {#if corners.tr}
      <ThemeCorner {theme} class="absolute -right-0.5 -top-0.5 rotate-90" />
    {/if}
    {#if corners.br}
      <ThemeCorner {theme} class="absolute -bottom-0.5 -right-0.5 rotate-180" />
    {/if}
    {#if corners.bl}
      <ThemeCorner {theme} class="absolute -bottom-0.5 -left-0.5 -rotate-90" />
    {/if}
  {/if}
</div>
