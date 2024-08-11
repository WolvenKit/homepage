<script lang="ts">
  import triangle from "$assets/triangle.svg";
  import GlitchingImage from "$components/elements/GlitchingImage.svelte";

  export let title = "An error has occured.";
  export let message = "";
  // eslint-disable-next-line no-undef
  export let error: App.Error | undefined = undefined;
  console.log(error);
</script>

<div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
  <div class="size-28 bg-red mix-blend-lighten">
    <GlitchingImage always src={triangle} class="relative size-28 bg-black p-2 mix-blend-multiply">
      <div class="absolutely-centered -translate-y-1/4 text-5xl font-semibold">!</div>
    </GlitchingImage>
  </div>

  <div>
    <div class="text-4xl text-red"><slot name="title">{title}</slot></div>
    <p><slot>{message || error?.description || ""}</slot></p>
    <code class="text-sm text-zinc-400">
      <slot name="code">
        {#if error}
          {error.name || "Error"}{#if error.status}
            {error.status}{/if}: {error.message}{#if error.code}: {#if error.errno}{error.errno}
            {/if}{error.code}{/if}
        {/if}
      </slot>
    </code>
  </div>
</div>
