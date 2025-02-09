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
    crossed?: boolean;
    children?: Snippet;
  }

  const { theme = "default", key = "", value = "", class: classes = "", crossed = false, children }: Props = $props();

  const themeClasses = $derived(THEME_CLASSES[theme]);
</script>

<div
  class={twMerge(
    "relative flex max-w-full shrink flex-col items-center justify-between",
    crossed && "after:border-red after:absolute after:-top-1/3 after:h-[150%] after:-rotate-45 after:border-r-2",
    classes,
  )}
>
  <dt class={twMerge("text-sm font-semibold text-zinc-300 uppercase", themeClasses.font, themeClasses.label)}>
    <StringSnippet children={key} />
  </dt>
  <dd class="max-w-full overflow-hidden text-2xl text-ellipsis"><StringSnippet children={value || children} /></dd>
</div>
