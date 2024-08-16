<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Heading from "$components/elements/Heading.svelte";
  import ThemeFrameBig from "$components/theme/ThemeFrameBig.svelte";
  import ThemeButton from "$components/theme/ThemeButton.svelte";
  import { outlineToPath, scalePath, THEME_CORNERS } from "$lib/themes";
  import Warning from "../Warning.svelte";
  import GlitchingWebsite from "./GlitchingWebsite.svelte";

  const emit = createEventDispatcher<{ close: void }>();

  onMount(() => {
    document.scrollingElement?.classList.add("overflow-hidden");

    return () => {
      document.scrollingElement?.classList.remove("overflow-hidden");
    };
  });

  const corners = { tr: true, bl: true };
  const clipPath = outlineToPath(scalePath(THEME_CORNERS.cyberpunk!.outline, 2), corners);
</script>

<dialog open class="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-transparent">
  <GlitchingWebsite class="absolute inset-0 " />

  <!-- overlay -->
  <div class="absolute inset-0 bg-black/10" />

  <div class="dialog relative z-10">
    <div class="flex gap-8 bg-black p-8 text-white" style:clip-path={clipPath}>
      <ThemeFrameBig theme="cyberpunk" {corners} scale={2} class="right-[unset] w-[round(down,100%,1px)] text-red" />

      <Warning />

      <div class="flex h-full w-full flex-col items-start">
        <Heading class="m-0 text-red">Website malfunction detected</Heading>
        <p class="max-w-screen-sm text-xl">
          The website has been left idle for so long that it has been infested by rogue AIs from beyond the Blackwall.
        </p>

        <ThemeButton
          on:click={() => emit("close")}
          theme="cyberpunk"
          class="-mb-8 -mr-8 ml-auto mt-auto border-red"
          cornerClass="text-red"
        >
          Oh no
        </ThemeButton>
      </div>
    </div>
  </div>
</dialog>

<style>
  .dialog {
    filter: drop-shadow(0 0 1rem black);
  }
</style>
