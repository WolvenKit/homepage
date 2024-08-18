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

<div class={twMerge("flex flex-col items-center justify-between", classes)}>
  <dt class={twMerge("font-semibold uppercase text-zinc-300", themeClasses.font, themeClasses.label)}>
    <slot name="key">{key}</slot>
  </dt>
  <dd class="text-2xl"><slot>{value}</slot></dd>
</div>
