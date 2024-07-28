<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { THEME_COLORS, type Theme } from "$lib/themes";
  import { tw } from "$lib/utils";

  export let theme: Theme;
  let classes = "";
  export { classes as class };

  const THEME = {
    Cyberpunk: tw`border-2`,
    Witcher: tw`border p-1`,
  } satisfies Record<Theme, string>;
</script>

<div
  class={twMerge(
    "pointer-events-none absolute inset-0 border-current",
    THEME[theme],
    THEME_COLORS[theme].border.text,
    classes,
  )}
>
  {#if theme == "Witcher"}
    <div
      class="witcher-inner-border h-full w-full border-y-2 border-current before:rotate-0 after:rotate-180 pseudo:inline-block pseudo:h-full pseudo:w-1/2 pseudo:bg-current pseudo:clip-[var(--witcher-border-caret)]"
    />
  {/if}
</div>
