<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import DotsBackground from "./DotsBackground.svelte";

  let classes = "";
  export { classes as class };
</script>

<div class={twMerge("absolute inset-0 overflow-hidden", classes)}>
  <DotsBackground repeats={1} duration="4s" class="left-2/3 translate-x-6 skew-x-6 max-lg:hidden" />
  <DotsBackground repeats={1} duration="4s" class="right-2/3 -translate-x-6 rotate-180 -skew-x-6 max-lg:hidden" />
</div>
