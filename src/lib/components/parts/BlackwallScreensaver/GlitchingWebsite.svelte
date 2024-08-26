<script lang="ts">
  import { onMount } from "svelte";
  import type { HTMLCanvasAttributes } from "svelte/elements";
  import { browser } from "$app/environment";
  import type { Point } from "$lib/utils";
  import { renderElement } from "./renderer";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface $$Props extends HTMLCanvasAttributes {
    updateChance?: number;
    cleanChance?: number;
    resetChanceMultiplier?: number;
    movementRange?: number;
    maxArea?: number;
    rootElement?: HTMLElement;
  }

  export let updateChance = 0.8;
  export let cleanChance = 0.4;
  export let resetChanceMultiplier = 0.00001;
  export let movementRange = 4;
  export let maxArea = 0.1;
  export let rootElement: HTMLElement | undefined = browser ? document.body : undefined;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let offscreen: OffscreenCanvas;
  let offCtx: OffscreenCanvasRenderingContext2D;
  let pageImage: ImageData;
  let origData: Uint8Array;

  let animFrame = 0;
  let resetChance = 0;

  $: rootBbox = rootElement?.getBoundingClientRect();
  $: rootOffset = [rootBbox?.left || 0, rootBbox?.top || 0] as Point;

  onMount(() => {
    ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    ctx.fillStyle = "transparent";
    ctx.strokeStyle = "transparent";

    offscreen = new OffscreenCanvas(0, 0);
    offCtx = offscreen.getContext("2d")!;

    update();

    return () => animFrame && window.cancelAnimationFrame(animFrame);
  });

  $: if (ctx && rootElement) resize(true).catch(console.error);

  async function resize(rerender = true) {
    canvas.width = Math.min(rootElement?.clientWidth || Number.POSITIVE_INFINITY, window.innerWidth);
    canvas.height = Math.min(rootElement?.clientHeight || Number.POSITIVE_INFINITY, window.innerHeight);
    offscreen.width = canvas.width + rootOffset[0];
    offscreen.height = canvas.height + rootOffset[1];

    pageImage = new ImageData(canvas.width, canvas.height);
    if (rerender) await render();
  }

  async function render() {
    await renderElement(offCtx, rootElement || document.body, true);

    const image = offCtx.getImageData(...rootOffset, pageImage.width, pageImage.height);
    origData = new Uint8Array(image.data);
  }

  function update() {
    animFrame = window.requestAnimationFrame(update);

    if (!pageImage || !origData || Math.random() > updateChance) return;

    const pageArea = pageImage.width * pageImage.height;

    const start = Math.floor(Math.random() * pageImage.data.length);
    const remain = pageImage.data.length - start;
    const length = Math.floor(Math.random() * Math.min(pageArea * maxArea * 4, remain));
    const slice = origData.slice(start, start + length);

    // random chance to do a cleaning paste
    if (Math.random() < cleanChance) {
      slice.fill(0);
      resetChance -= resetChanceMultiplier * (length / pageArea);
    } else {
      resetChance += resetChanceMultiplier * (length / pageArea);
    }

    const targetStart = Math.floor(start + (Math.random() - 0.5) * pageImage.width * 4 * movementRange);

    for (let i = 0; i < length && i + targetStart < pageImage.data.length; i++) {
      pageImage.data[i + targetStart] = slice[i];
    }

    // Clean up if too dirty
    if (Math.random() < resetChance) {
      for (let i = 0; i < pageImage.data.length; i++) {
        pageImage.data[i] = 0;
      }
      resetChance = 0;
    }

    ctx.putImageData(pageImage, 0, 0);
  }
</script>

<svelte:window on:resize={() => resize()} />

<canvas bind:this={canvas} {...$$restProps} class:pointer-events-none={true} />
