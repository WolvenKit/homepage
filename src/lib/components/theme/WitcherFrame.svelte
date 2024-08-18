<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { THEME_CLASSES } from "$lib/themes";

  let classes = "";
  export { classes as class };
</script>

<div
  class={twMerge(
    "pointer-events-none absolute inset-0 border border-current p-1",
    THEME_CLASSES.witcher.border.text,
    classes,
  )}
>
  <div
    class="h-full w-full border-y-2 border-current before:rotate-0 after:rotate-180 pseudo:inline-block pseudo:h-full pseudo:w-1/2 pseudo:bg-current pseudo:clip-[var(--witcher-border-caret)]"
  />
</div>
