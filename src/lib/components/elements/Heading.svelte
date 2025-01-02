<script lang="ts">
  import type { Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";

  type Level = 1 | 2 | 3;

  const LEVELS = {
    1: "text-5xl uppercase text-white font-bold",
    2: "text-4xl uppercase text-zinc-300",
    3: "text-2xl uppercase text-zinc-300",
  } satisfies Record<Level, string>;

  interface Props {
    level?: Level;
    class?: string;
    children?: Snippet;
  }

  let { level = 1, class: classes = "", children }: Props = $props();
</script>

<h2 class={twMerge("-mb-8 text-center", LEVELS[level], classes)}>{@render children?.()}</h2>
