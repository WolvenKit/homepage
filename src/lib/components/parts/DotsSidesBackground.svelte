<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import DotsBackground from "./DotsBackground.svelte";

  export let landing = false;
  let classes = "";
  export { classes as class };

  $: repeats = landing ? 2 : 1;
</script>

<div class={twMerge("pointer-events-none absolute inset-0 overflow-hidden max-lg:hidden", classes)}>
  <div class="perspective h-full w-full">
    <DotsBackground
      {repeats}
      duration="4s"
      maskPos={[75, 50]}
      class={twMerge("transition-all duration-700", "-right-1/4 left-2/3 translate-x-6", landing && "left-0")}
    />

    <DotsBackground
      {repeats}
      duration="4s"
      maskPos={[75, 50]}
      class={twMerge("transition-all duration-700", "-left-1/4 right-2/3 rotate-180", landing && "right-full")}
    />
  </div>
</div>

<style>
  .perspective {
    transform: perspective(48rem) rotateX(15deg);
  }
</style>
