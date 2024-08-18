<script lang="ts" context="module">
  export const vercelImg = (sourceUrl: string, size: number, quality: number) =>
    `/_vercel/image?url=${encodeURIComponent(sourceUrl)}&w=${size}&q=${quality}`;
</script>

<script lang="ts">
  import type { HTMLImgAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";
  import { browser, dev } from "$app/environment";
  import { mediaReady } from "$lib/actions/mediaReady";

  // Must match svelte.config.js
  const SIZES = [128, 256, 720, 1280, 1920, 3840];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface $$Props extends Omit<HTMLImgAttributes, "src"> {
    optimize?: boolean;
    quality?: number;
    src: string;
  }

  export let optimize = true;
  export let quality = 75;
  export let src: string;
  export let width: string | number | null | undefined = null;

  let loaded = false;

  // Find suitable size
  $: size =
    !dev && optimize && width
      ? ((width) => {
          for (const size of SIZES) {
            if (size >= width) return size;
          }
        })(+width)
      : undefined;

  $: _src = size ? vercelImg(src, size, quality) : src;
  $: classes = twMerge("transition", !loaded && browser && "opacity-0", $$restProps.class);
</script>

<img
  use:mediaReady={() => (loaded = true)}
  decoding="async"
  loading="lazy"
  crossorigin="anonymous"
  src={_src}
  {width}
  {...$$restProps}
  alt={$$props.alt ?? ""}
  class={classes}
/>
