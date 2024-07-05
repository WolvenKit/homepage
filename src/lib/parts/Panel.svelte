<script lang="ts">
  import { twMerge } from "tailwind-merge";

  export let slant = 16;
  let classes = "";
  export { classes as class };
</script>

<div class={twMerge("panel absolute inset-0 -z-10 bg-gray-950 transition", classes)} style:--slant="{slant}px">
  <slot />
</div>

<style>
  .panel {
    --offset: calc(100% - var(--slant));
    clip-path: polygon(var(--slant) 0%, 100% 0%, 100% 100%, 0% 100%, 0% var(--slant));
  }
</style>
