<script lang="ts">
  import { onDestroy } from "svelte";
  import { twMerge } from "tailwind-merge";
  import cube from "$assets/cube.webp";
  import sammy from "$assets/sammy.png";
  import Image from "../elements/Image.svelte";

  export let isOnTop = false;
  let classes = "";
  export { classes as class };

  let element: HTMLElement;
  let easterEgg = false;
  let timeout = 0;

  function clear() {
    if (timeout) clearTimeout(timeout);
    timeout = 0;
    // easterEgg = false; // Reset?
  }

  function onMouseEnter() {
    clear();

    timeout = setTimeout(() => {
      // Check
      if (element.parentElement?.querySelector(":hover") === element) {
        easterEgg = true;
      }
    }, 10 * 1000);
  }

  function onMouseLeave() {
    clear();
  }

  onDestroy(clear);
</script>

<a
  bind:this={element}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
  href="/"
  class={twMerge(
    "relative z-10 mt-auto flex-shrink-0 rounded-b-full bg-zinc-900 p-4 shadow-xl transition duration-500",
    isOnTop && "script:bg-transparent script:shadow-none",
  )}
>
  {#if easterEgg}
    <Image src={cube} width="128" height="128" alt="" class="fade-in absolute h-24 w-auto" />
  {/if}

  <Image
    src={sammy}
    width="128"
    height="128"
    fetchpriority="high"
    loading="eager"
    alt=""
    class={twMerge("h-24 w-auto transition-opacity duration-1000", easterEgg && "opacity-0", classes)}
  />
</a>
