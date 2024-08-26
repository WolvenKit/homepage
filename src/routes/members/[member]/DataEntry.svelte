<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { THEME_CLASSES, type Theme } from "$lib/themes";

  export let theme: Theme = "default";
  export let key = "";
  export let value = "";
  let classes = "";
  export { classes as class };

  $: themeClasses = THEME_CLASSES[theme];
</script>

<div class={twMerge("flex max-w-full flex-shrink flex-col items-center justify-between", classes)}>
  <dt class={twMerge("text-sm font-semibold uppercase text-zinc-300", themeClasses.font, themeClasses.label)}>
    <slot name="key">{key}</slot>
  </dt>
  <dd class="max-w-full overflow-hidden text-ellipsis text-2xl"><slot>{value}</slot></dd>
</div>
