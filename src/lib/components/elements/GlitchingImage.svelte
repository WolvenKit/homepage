<script lang="ts">
  import { onDestroy, type ComponentProps, type Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { browser } from "$app/environment";
  import LazyImage from "./LazyImage.svelte";

  interface Props extends ComponentProps<typeof LazyImage> {
    always?: boolean;
    imageClass?: string;
    bypass?: boolean;
    children?: Snippet;
  }

  let { always = false, class: classes = "", imageClass = "", bypass = false, children, ...rest }: Props = $props();

  function random(r: number) {
    // I hope this will be good for performance
    // since we only use random when in use?
    return r ? Math.random() : 0.5;
  }

  let rand = $state(0);
  let reRandTimeout = 0;

  function startReRandom() {
    reRandTimeout = setTimeout(() => {
      rand = Math.random();
      startReRandom();
    }, Math.random() * 5000);
  }

  function stopReRandom() {
    if (reRandTimeout) clearTimeout(reRandTimeout);
    reRandTimeout = 0;
  }

  onDestroy(stopReRandom);

  if (always && browser) startReRandom();
  else stopReRandom();
  // Config-ish
  let glitchLength = $derived(always ? 1 : 0.4);
  let shakeLength = $derived(always ? 2 : 0.5);
</script>

{#if bypass}
  <LazyImage {...rest} class={twMerge(classes, imageClass)} />
{:else}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_mouse_events_have_key_events -->
  <div
    class={twMerge("glitch grid", classes)}
    style:--glitch-length="{glitchLength + random(rand)}s"
    style:--glitch-offset="{-random(rand)}s"
    style:--glitch-dir={random(rand) > 0.5 ? "normal" : "reverse"}
    style:--shake-length="{shakeLength + random(rand)}s"
    style:--shake-offset="{-random(rand)}s"
    style:--shake-dir={random(rand) > 0.5 ? "normal" : "reverse"}
    style:--blend-length="{1 + random(rand)}s"
    style:--blend-offset="{-random(rand)}s"
    style:--blend-dir={random(rand) > 0.5 ? "normal" : "reverse"}
    style:--repeat={always ? "infinite" : Math.ceil(Math.random() * 3)}
    class:always
    onmouseover={() => (rand = Math.random())}
  >
    <LazyImage {...rest} class={twMerge("col-start-1 row-start-1 h-full w-full object-cover", imageClass)} />
    {@render children?.()}
    <LazyImage
      {...rest}
      class={twMerge(
        "pointer-events-none col-start-1 row-start-1 hidden h-full w-full object-cover transition-none",
        imageClass,
      )}
    />
  </div>
{/if}

<style>
  .glitch:hover > :global(img:last-of-type),
  .glitch.always > :global(img:last-of-type) {
    display: inline;
    animation:
      glitch var(--glitch-length) steps(3, jump-start) var(--glitch-offset) var(--repeat) var(--glitch-dir),
      shake var(--shake-length) steps(2, jump-none) var(--shake-offset) var(--repeat) var(--shake-dir),
      blend var(--blend-length) steps(2, jump-none) var(--blend-offset) var(--repeat) var(--blend-dir);
    animation-composition: add;
  }

  @keyframes glitch {
    0% {
      opacity: 1;
      clip-path: polygon(0 10%, 100% 10%, 100% 30%, 0 30%, 0 50%, 100% 50%, 100% 70%, 0 70%);
    }
    20% {
      clip-path: polygon(0 0, 100% 0, 100% 30%, 0 30%, 0 70%, 100% 70%, 100% 100%, 0 100%);
    }
    40% {
      clip-path: polygon(20% 40%, 20% 20%, 100% 20%, 100% 40%, 20% 40%, 0 60%, 80% 60%, 80% 80%, 0 80%, 0 60%);
    }
    60% {
      clip-path: polygon(0 0, 100% 0, 100% 10%, 0 10%, 0 90%, 100% 90%, 100% 100%, 0 100%);
    }
    80% {
      clip-path: polygon(0 30%, 100% 30%, 100% 70%, 0 70%);
    }
    100% {
      clip-path: polygon(0 40%, 100% 40%, 100% 60%, 0 60%, 0 80%, 100% 80%, 100% 100%, 0 100%);
      opacity: 1;
    }
  }

  @keyframes shake {
    0% {
      transform: translate(0, 0.5rem);
    }
    25% {
      transform: translate(0.3rem, -4%);
    }
    50% {
      transform: translate(5%, 0);
    }
    75% {
      transform: translate(0.4rem, 0.5rem);
    }
    100% {
      transform: translate(-4%, 2%);
    }
  }

  @keyframes blend {
    0% {
      mix-blend-mode: screen;
    }
    50% {
      mix-blend-mode: luminosity;
    }
    100% {
      mix-blend-mode: exclusion;
    }
  }
</style>
