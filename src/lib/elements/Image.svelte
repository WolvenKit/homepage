<script lang="ts">
  import type { HTMLImgAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface $$Props extends HTMLImgAttributes {}
</script>

<img decoding="async" loading="lazy" {...$$restProps} alt={$$props.alt ?? ""} class={twMerge("", $$restProps.class)} />
