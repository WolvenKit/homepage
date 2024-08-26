<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import triangle from "$assets/triangle.svg";
  import GlitchingImage from "$components/elements/GlitchingImage.svelte";

  let classes = "";
  export { classes as class };
</script>

<div class={twMerge("size-28 bg-red mix-blend-lighten", classes)}>
  <GlitchingImage always src={triangle} class="relative h-full w-auto bg-black p-2 mix-blend-multiply">
    <div class="absolutely-centered -translate-y-1/4 text-5xl font-semibold text-white">!</div>
  </GlitchingImage>
</div>
