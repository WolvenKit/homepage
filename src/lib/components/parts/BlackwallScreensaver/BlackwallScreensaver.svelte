<script lang="ts">
  import { onDestroy } from "svelte";

  let idle = false;

  let timeout = 0;

  function resetTimeout() {
    if (timeout) clearTimeout(timeout);

    // Don't do this on phones ig
    if (window.innerWidth < 768) return;

    timeout = setTimeout(
      () => {
        idle = true;
      },
      1000 * 60 * 2, // 2 minutes?
    );
  }

  onDestroy(() => {
    if (timeout) clearTimeout(timeout);
  });
</script>

<svelte:window
  on:mousemove={resetTimeout}
  on:mousedown={resetTimeout}
  on:keydown={resetTimeout}
  on:focus={resetTimeout}
  on:blur={resetTimeout}
/>

{#if idle}
  {#await import("./BlackwallScreensaveInner.svelte") then { default: IdleBlackwall }}
    <IdleBlackwall on:close={() => (idle = false)} />
  {/await}
{/if}
