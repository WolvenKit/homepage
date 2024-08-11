<script lang="ts">
  import type { HTMLImgAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";
  import { browser } from "$app/environment";
  import { mediaReady } from "$lib/actions/mediaReady";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type $$Props = HTMLImgAttributes;

  let loaded = false;
</script>

<img
  use:mediaReady={() => (loaded = true)}
  decoding="async"
  loading="lazy"
  crossorigin="anonymous"
  {...$$restProps}
  alt={$$props.alt ?? ""}
  class={twMerge("transition", !loaded && browser && "opacity-0", $$restProps.class)}
/>
