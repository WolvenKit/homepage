<script lang="ts">
  import { onMount } from "svelte";
  import type { HTMLCanvasAttributes } from "svelte/elements";
  import { renderElement } from "./renderer";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type $$Props = HTMLCanvasAttributes;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let offscreen: OffscreenCanvas;
  let offCtx: OffscreenCanvasRenderingContext2D;
  let pageImage: ImageData;
  let origData: Uint8Array;

  let animFrame = 0;
  let resetChance = 0;

  onMount(() => {
    ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    ctx.fillStyle = "transparent";
    ctx.strokeStyle = "transparent";

    offscreen = new OffscreenCanvas(canvas.width, canvas.height);
    offCtx = offscreen.getContext("2d")!;

    resize(true).catch(console.error);
    update();

    return () => animFrame && window.cancelAnimationFrame(animFrame);
  });

  async function resize(rerender = true) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;

    pageImage = new ImageData(canvas.width, canvas.height);
    if (rerender) await render();
  }

  async function render() {
    await renderElement(offCtx, document.body, true);
    const image = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
    origData = new Uint8Array(image.data);
  }

  function update() {
    animFrame = window.requestAnimationFrame(update);

    if (!pageImage || !origData || Math.random() > 0.7) return;

    const pageArea = pageImage.width * pageImage.height;

    const start = Math.floor(Math.random() * pageImage.data.length);
    const remain = pageImage.data.length - start;
    const length = Math.floor(Math.random() * Math.min(pageArea * 0.1 * 3, remain));
    const slice = origData.slice(start, start + length);

    // random chance to do a cleaning paste
    if (Math.random() < 0.4) {
      slice.fill(0);
      resetChance -= (0.00001 * length) / pageArea;
    } else {
      resetChance += (0.00001 * length) / pageArea;
    }

    const sourceMid = start + length * 0.5;
    const target = Math.floor(sourceMid + (Math.random() - 0.5) * pageImage.width * 0.1);

    for (let i = -Math.min(target, 0); i < length && i + target < pageImage.data.length; i++) {
      pageImage.data[i + target] = slice[i];
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

<canvas bind:this={canvas} {...$$restProps} />
