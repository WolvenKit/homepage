<script lang="ts">
  import { onMount } from "svelte";
  import Heading from "$components/elements/Heading.svelte";
  import ThemeButton from "$components/theme/ThemeButton.svelte";
  import ThemeFrameBig from "$components/theme/ThemeFrameBig.svelte";
  import { outlineToPath, scalePath, THEME_CORNERS } from "$lib/themes";
  import Warning from "../Warning.svelte";
  import GlitchingWebsite from "./GlitchingWebsite.svelte";

  interface Props {
    onClose?: () => void;
  }

  const { onClose }: Props = $props();

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
  <div class="absolute inset-0 bg-black/10"></div>

  <div class="dialog relative z-10">
    <div class="flex gap-8 bg-black p-8 text-white max-md:flex-wrap" style:clip-path={clipPath}>
      <ThemeFrameBig theme="cyberpunk" {corners} scale={2} class="text-red right-[unset] w-[round(down,100%,1px)]" />

      <Warning class="shrink-0 max-md:mx-auto" />

      <div class="flex h-full w-full flex-col items-start">
        <Heading class="text-red m-0">Website malfunction detected</Heading>
        <p class="max-w-(--breakpoint-sm) text-xl">
          The website has been left idle for so long that it has been infested by rogue AIs from beyond the Blackwall.
        </p>

        <ThemeButton
          onClick={onClose}
          theme="cyberpunk"
          class="border-red mt-auto -mr-8 -mb-8 ml-auto"
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
