<script lang="ts">
  import { onMount } from "svelte";

  let idle = $state(false);

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
  onmousemove={resetTimeout}
  onmousedown={resetTimeout}
  onkeydown={resetTimeout}
  onfocus={resetTimeout}
  onblur={resetTimeout}
/>

{#if idle}
  {#await import("./BlackwallScreensaveInner.svelte") then { default: IdleBlackwall }}
    <IdleBlackwall onClose={() => (idle = false)} />
  {/await}
{/if}
