<script lang="ts">
  import { onDestroy } from "svelte";
  import type { HTMLImgAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";
  import { browser } from "$app/environment";
  import Image from "./Image.svelte";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface $$Props extends Omit<HTMLImgAttributes, "class"> {
    always?: boolean;
    class?: string;
  }

  function random(_: number) {
    return Math.random();
  }

  let rand = Math.random();
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

  export let always = false;
  let classes = "";
  export { classes as class };

  $: if (always && browser) startReRandom();
  else stopReRandom();
  $: glitchLength = always ? 1 : 0.4;
  $: shakeLength = always ? 2 : 0.5;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
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
  on:mouseover={() => (rand = Math.random())}
>
  <Image {...$$restProps} class="col-start-1 row-start-1 h-full w-full" />
  <Image {...$$restProps} class="pointer-events-none col-start-1 row-start-1 hidden h-full w-full transition-none" />
</div>

<style>
  .glitch:hover > :global(img:nth-child(2)),
  .glitch.always > :global(img:nth-child(2)) {
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
