<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import DotsBackground from "./DotsBackground.svelte";

  export let landing = false;
  let classes = "";
  export { classes as class };

  $: repeats = landing ? 2 : 1;
</script>

<div class={twMerge("pointer-events-none absolute inset-0 overflow-hidden max-lg:hidden", classes)}>
  <DotsBackground
    {repeats}
    duration="4s"
    class={twMerge("transition-all duration-700", "left-2/3 translate-x-6 skew-x-6", landing && "left-0")}
  />

  <DotsBackground
    {repeats}
    duration="4s"
    class={twMerge(
      "transition-all duration-700",
      "right-2/3 -translate-x-6 rotate-180 -skew-x-6",
      landing && "right-full",
    )}
  />
</div>
