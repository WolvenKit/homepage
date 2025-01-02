<script lang="ts">
  import { onMount } from "svelte";
  import type { HTMLCanvasAttributes } from "svelte/elements";
  import { browser } from "$app/environment";
  import type { Point } from "$lib/utils";
  import { renderElement } from "./renderer";

  interface Props extends HTMLCanvasAttributes {
    updateChance?: number;
    cleanChance?: number;
    resetChanceMultiplier?: number;
    movementRange?: number;
    maxArea?: number;
    rootElement?: HTMLElement;
  }

  let {
    updateChance = 0.8,
    cleanChance = 0.4,
    resetChanceMultiplier = 0.00001,
    movementRange = 4,
    maxArea = 0.1,
    rootElement = browser ? document.body : undefined,
    ...rest
  }: Props = $props();

  let canvas: HTMLCanvasElement | undefined = $state();
  let ctx: CanvasRenderingContext2D | undefined = $state();

  let offscreen: OffscreenCanvas;
  let offCtx: OffscreenCanvasRenderingContext2D;
  let pageImage: ImageData;
  let origData: Uint8Array;

  let animFrame = 0;
  let resetChance = 0;

  onMount(() => {
    ctx = canvas?.getContext("2d") || undefined;
    if (!ctx) return;

    ctx.fillStyle = "transparent";
    ctx.strokeStyle = "transparent";

    offscreen = new OffscreenCanvas(0, 0);
    offCtx = offscreen.getContext("2d")!;

    update();

    return () => animFrame && window.cancelAnimationFrame(animFrame);
  });

  async function resize(rerender = true) {
    if (!canvas) return;
    canvas.width = Math.min(rootElement?.clientWidth || Number.POSITIVE_INFINITY, window.innerWidth);
    canvas.height = Math.min(rootElement?.clientHeight || Number.POSITIVE_INFINITY, window.innerHeight);
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;

    pageImage = new ImageData(canvas.width, canvas.height);
    if (rerender) await render();
  }

  async function render() {
    await renderElement(offCtx, rootElement || document.body, rootOffset, true);

    const image = offCtx.getImageData(0, 0, pageImage.width, pageImage.height);
    origData = new Uint8Array(image.data);
  }

  function update() {
    animFrame = window.requestAnimationFrame(update);

    if (!ctx || !pageImage || !origData || Math.random() > updateChance) return;

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
  let rootBbox = $derived(rootElement?.getBoundingClientRect());
  let rootOffset = $derived([rootBbox?.left || 0, rootBbox?.top || 0] as Point);
  $effect.pre(() => {
    if (ctx && rootElement) resize(true).catch(console.error);
  });
</script>

<svelte:window onresize={() => resize()} />

<canvas bind:this={canvas} {...rest} class:pointer-events-none={true}></canvas>
