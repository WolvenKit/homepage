<script lang="ts">
  import type { HTMLImgAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";
  import { mediaReady } from "$lib/actions/mediaReady";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface $$Props extends Omit<HTMLImgAttributes, "src"> {
    src: string;
  }

  export let src: string;
  let classes: string | null | undefined = "";
  export { classes as class };

  let loaded = false;
</script>

<img
  use:mediaReady={() => (loaded = true)}
  decoding="async"
  loading="lazy"
  crossorigin="anonymous"
  {src}
  {...$$restProps}
  alt={$$props.alt ?? ""}
  class={twMerge("transition", !loaded && "script:opacity-0", classes)}
/>
