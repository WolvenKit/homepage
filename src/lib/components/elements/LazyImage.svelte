<script lang="ts">
  import type { HTMLImgAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";
  import { mediaReady } from "$lib/actions/mediaReady";

  interface Props extends Omit<HTMLImgAttributes, "src" | "class"> {
    src: string;
    class?: string;
  }

  const { src, class: classes = "", ...restProps }: Props = $props();

  let loaded = $state(false);
</script>

<img
  use:mediaReady={() => (loaded = true)}
  decoding="async"
  loading="lazy"
  crossorigin="anonymous"
  {src}
  {...restProps}
  alt={restProps.alt ?? ""}
  class={twMerge("transition", !loaded && "script:opacity-0", classes)}
/>
