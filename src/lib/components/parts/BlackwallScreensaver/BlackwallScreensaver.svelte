<script lang="ts">
  import { onMount } from "svelte";

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
      1000 * 60 * 5, // 5 minutes?
    );
  }

  onMount(() => {
    resetTimeout();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).triggerScreensaver = () => (idle = true);

    return () => timeout && clearTimeout(timeout);
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
