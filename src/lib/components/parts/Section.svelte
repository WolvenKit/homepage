<script lang="ts">
  import { twMerge } from "tailwind-merge";

  export let as = "div";
  let classes = "";
  export { classes as class };
</script>

<svelte:element
  this={as}
  class={twMerge("relative my-8 flex w-full flex-grow flex-col items-center gap-16 p-2 py-8", classes)}
>
  <slot></slot>
</svelte:element>
