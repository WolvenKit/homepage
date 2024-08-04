<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { THEME_COLORS, type Theme } from "$lib/themes";
  import { tw } from "$lib/utils";

  export let theme: Theme = "default";
  let classes = "";
  export { classes as class };

  const THEME: Record<Theme, string> = {
    default: "",
    cyberpunk: tw`ring-2 ring-current`,
    witcher: tw`border p-1`,
  };
</script>

<div
  class={twMerge(
    "pointer-events-none absolute inset-0 border-current",
    theme && THEME[theme],
    theme && THEME_COLORS[theme].border.text,
    classes,
  )}
>
  {#if theme == "witcher"}
    <div
      class="h-full w-full border-y-2 border-current before:rotate-0 after:rotate-180 pseudo:inline-block pseudo:h-full pseudo:w-1/2 pseudo:bg-current pseudo:clip-[var(--witcher-border-caret)]"
    />
  {/if}
</div>
