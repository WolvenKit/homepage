<script lang="ts">
  import type { Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";
  import StringSnippet from "$components/elements/StringSnippet.svelte";
  import { THEME_CLASSES, type Theme } from "$lib/themes";

  interface Props {
    theme?: Theme;
    key?: string | Snippet;
    value?: string | Snippet;
    class?: string;
    children?: Snippet;
  }

  const { theme = "default", key = "", value = "", class: classes = "", children }: Props = $props();

  const themeClasses = $derived(THEME_CLASSES[theme]);
</script>

<div class={twMerge("flex max-w-full flex-shrink flex-col items-center justify-between", classes)}>
  <dt class={twMerge("text-sm font-semibold uppercase text-zinc-300", themeClasses.font, themeClasses.label)}>
    <StringSnippet children={key} />
  </dt>
  <dd class="max-w-full overflow-hidden text-ellipsis text-2xl"><StringSnippet children={value || children} /></dd>
</div>
