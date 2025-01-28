<script lang="ts">
  import { onMount } from "svelte";
  import type { HTMLCanvasAttributes } from "svelte/elements";
  import { browser } from "$app/environment";
  import type { Point } from "$lib/utils";
  import { renderElement } from "./renderer";

  type Color = [r: number, g: number, b: number, a?: number];

  interface Props extends HTMLCanvasAttributes {
    updateChance?: number;
    cleanChance?: number;
    resetChanceMultiplier?: number;
    movementRange?: number;
    replaceBackgroundChance?: number;
    maxArea?: number;
    shapeRatio?: number;
    backgroundColor?: Color;
    rootElement?: HTMLElement;
  }

  let {
    updateChance = 0.8,
    cleanChance = 0.4,
    resetChanceMultiplier = 0.00001,
    movementRange = 0.2,
    replaceBackgroundChance = 0.5,
    maxArea = 0.1,
    shapeRatio = 0.1,
    backgroundColor = [24, 24, 27],
    rootElement = browser ? document.body : undefined,
    ...rest
  }: Props = $props();

  let canvas: HTMLCanvasElement | undefined = $state();
  let ctx: CanvasRenderingContext2D | undefined = $state();

  let offscreen: OffscreenCanvas;
  let offCtx: OffscreenCanvasRenderingContext2D;
  let pageImage: ImageData;
  let origData: Uint8Array;

  let maxSideLength = 0;
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
    maxSideLength = Math.sqrt(pageImage.width * pageImage.height * maxArea);
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

    // Clean up every now and then
    if (Math.random() < resetChance) {
      pageImage.data.fill(0);
      resetChance = 0;
      ctx.putImageData(pageImage, 0, 0);
      return;
    }

    // Random chance to do a cleaning paste
    if (Math.random() < cleanChance) {
      const start = Math.floor(Math.random() * pageImage.data.length);
      const end = Math.floor(
        Math.random() * Math.min(pageImage.data.length * maxArea * 4, pageImage.data.length - start),
      );
      pageImage.data.fill(0, start, end);
      resetChance -= resetChanceMultiplier * ((end - start) / pageImage.data.length);
    }
    // Otherwise place a block of content
    else {
      // From
      const sx = Math.floor(Math.random() * pageImage.width);
      const sy = Math.floor(Math.random() * pageImage.height);
      const sz = Math.floor((Math.random() - 0.5) * 2 * 3); // Subpixel offset
      const width = Math.floor(Math.random() * maxSideLength * (1 - shapeRatio));
      const height = Math.floor(Math.random() * maxSideLength * shapeRatio);

      // To (relatively to source)
      const dx = Math.floor((Math.random() - 0.5) * movementRange * maxSideLength);
      const dy = Math.floor((Math.random() - 0.5) * movementRange * maxSideLength);
      const dz = Math.floor((Math.random() - 0.5) * 2 * 3); // Subpixel offset

      const replaceBackground = Math.random() < replaceBackgroundChance;
      const backgroundOffset = Math.random() < 0.5 ? 0 : dz;

      // Place
      outer: for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          for (let z = 0; z < 4; z++) {
            let toX = sx + x + dx;
            let toY = sy + y + dy;

            if (x > pageImage.width) {
              toX -= pageImage.width;
              toY++;
            }

            const sourceI = ((sy + y) * pageImage.width + (sx + x)) * 4 + z;
            const source = origData[sourceI + sz];
            if (source == undefined) break;

            const targetI = (toY * pageImage.width + toX) * 4 + z + dz;
            if (targetI > pageImage.data.length) break outer;

            if (replaceBackground && pageImage.data[sourceI + backgroundOffset] == 0) {
              pageImage.data[sourceI + backgroundOffset] = backgroundColor[z] ?? 255;
            }
            pageImage.data[targetI] = source;
          }
        }
      }

      resetChance += resetChanceMultiplier * ((width * height * 4) / pageImage.data.length);
    }

    // random chance to do a cleaning paste
    // if (Math.random() < cleanChance) {
    //   slice.fill(0);
    //   resetChance -= resetChanceMultiplier * (length / pageArea);
    // } else {
    //   resetChance += resetChanceMultiplier * (length / pageArea);

    //   // Fill source block with background
    //   for (let i = 0; i < length && i + start < pageImage.data.length; i++) {
    //     let colorI = (start + i) % 4;
    //     pageImage.data[start + i] = colorI == 3 ? 255 : backgroundColor[colorI];
    //   }
    // }

    // const targetStart = Math.floor(start + (Math.random() - 0.5) * pageImage.width * 4 * movementRange);

    // for (let i = 0; i < length && i + targetStart < pageImage.data.length; i++) {
    //   pageImage.data[targetStart + i] = slice[i];
    // }

    ctx.putImageData(pageImage, 0, 0);
  }
  let rootBbox = $derived(rootElement?.getBoundingClientRect());
  let rootOffset = $derived([rootBbox?.left || 0, rootBbox?.top || 0] as Point);
  $effect.pre(() => {
    if (ctx && rootElement) resize(true).catch(console.error);
  });
</script>

<svelte:window onresize={() => resize()} />

<canvas bind:this={canvas} {...rest} inert></canvas>
