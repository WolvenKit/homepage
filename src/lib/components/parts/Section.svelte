<script lang="ts">
  import type { Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";

  interface Props {
    as?: string;
    class?: string;
    children?: Snippet;
  }

  let { as = "div", class: classes = "", children }: Props = $props();
</script>

<svelte:element
  this={as}
  class={twMerge("relative my-8 flex w-full flex-grow flex-col items-center gap-16 p-2 py-8", classes)}
>
  {@render children?.()}
</svelte:element>
