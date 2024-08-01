<script lang="ts">
  import { createNoise3D } from "simplex-noise";
  import { onMount } from "svelte";

  const RESOLUTION = 0.5;
  const MAX_FPS = 30;
  const MIN_DELTA = 1000 / MAX_FPS;

  ///// Shared stuff
  export let elements: HTMLElement[] = [];

  ///// Internal variables
  const simplex = createNoise3D();
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let offscreen: OffscreenCanvas;
  let offCtx: OffscreenCanvasRenderingContext2D;
  let elementImage: ImageData | null = null;
  let animFrame = 0;
  let lastTimestamp = 0;

  type Box = [x: number, y: number, width: number, height: number];
  type Edge = [x: number, y: number, size: number];
  const edges: Edge[] = [];

  ///// On mount
  onMount(() => {
    ctx = canvas.getContext("2d")!;
    if (!ctx) return;
    offscreen = new OffscreenCanvas(canvas.width, canvas.height);
    offCtx = offscreen.getContext("2d")!;
    offCtx.imageSmoothingEnabled = false;

    resize(false);
    update();

    return () => window.cancelAnimationFrame(animFrame);
  });

  ///// Functions
  function resize(rerender = true) {
    canvas.width = canvas.clientWidth * RESOLUTION;
    canvas.height = canvas.clientHeight * RESOLUTION;
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    if (rerender) renderContent();
  }

  function renderContent(els: HTMLElement[] = elements) {
    if (!offCtx) return;

    const boxes: Box[] = [];

    offCtx.clearRect(0, 0, offscreen.width, offscreen.height);

    for (const element of els) {
      const style = window.getComputedStyle(element);
      const box: Box = [
        Math.floor(element.offsetLeft * RESOLUTION),
        Math.floor(element.offsetTop * RESOLUTION),
        Math.ceil(element.clientWidth * RESOLUTION),
        Math.ceil(element.clientHeight * RESOLUTION),
      ];
      boxes.push(box);

      if (element.tagName === "IMG") {
        // Image rendering
        const image = element as HTMLImageElement;
        if (!image.complete && !image.hasAttribute("data-cyberspaced")) {
          // skip unloaded image
          image.addEventListener("load", () => renderContent(), { once: true });
          image.setAttribute("data-cyberspaced", "");
          continue;
        }

        offCtx.drawImage(image, ...box);
      } else if (element.hasAttribute("data-cybertext")) {
        // Text rendering
        const fontSize = parseFloat(style.fontSize) * RESOLUTION;
        offCtx.font = style.font.replace(style.fontSize, fontSize + "px");
        offCtx.fillStyle = style.color;
        offCtx.textAlign = "start";
        offCtx.textBaseline = "top";

        const uppercase = style.textTransform.includes("uppercase");
        let text = element.textContent!;
        if (uppercase) text = text.toUpperCase();
        offCtx.fillText(text, box[0], box[1] + fontSize * 0.05);
      } else {
        const borderWidth = parseFloat(style.borderWidth);
        if (borderWidth) {
          offCtx.strokeStyle = style.borderColor;
          offCtx.lineWidth = parseFloat(style.borderWidth) * RESOLUTION;
          offCtx.strokeRect(...box);
        }

        offCtx.fillStyle = style.backgroundColor != "rgba(0, 0, 0, 0)" ? style.backgroundColor : "black";
        offCtx.fillRect(...box);
      }
    }

    elementImage = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);

    edgeRunner(boxes);
  }

  function edgeRunner(boxes: Box[]) {
    edges.length = 0;

    if (!elementImage) return;

    for (const box of boxes) {
      for (let x = box[0]; x <= box[0] + box[2]; x++) {
        let edge: Edge | null = null;

        for (let y = box[1]; y <= box[1] + box[3]; y++) {
          const pos = (y * elementImage.width + x) * 4;
          // if (pos < 0 || pos >= elementImage.data.length) continue;

          if (elementImage.data[pos + 3] >= 50) {
            if (!edge) edge = [x, y, 0];
          } else if (edge) {
            edge[2] = y - edge[1];
            edges.push(edge);
            edge = null;
          }
        }

        if (edge) {
          edge[2] = box[3] - edge[1];
          edges.push(edge);
          edge = null;
        }
      }
    }
  }

  function norm(v: number) {
    return (1 + v) * 0.5;
  }

  function update(timestamp = 0) {
    animFrame = window.requestAnimationFrame(update);

    if (timestamp - lastTimestamp < MIN_DELTA) return;
    lastTimestamp = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (elementImage) {
      for (const [x, y, size] of edges) {
        const height = y / canvas.height;
        // Mask for making chunks of rays
        const mask = norm(simplex(x * 0.01, y * 0.1, timestamp * 0.0001)) ** (2.5 + height);
        // Make tall objects have rays more often regardless of mask
        const val = (mask + (size / canvas.height) ** 2 * 0.5) * norm(simplex(x, y, timestamp * 0.001)) ** 1.5;

        if (val < 0.1) continue; // won't be eve visible

        const gradient = ctx.createLinearGradient(x, y, x, y - canvas.height);
        gradient.addColorStop(0.1, "cyan");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.globalAlpha = val * (1 - height) ** 0.5;

        ctx.fillRect(x, 0, 1, y + Math.min(size, 4));
      }
      // ctx.putImageData(elementImage, 0, 0);
    }
  }

  $: renderContent(elements);
</script>

<svelte:window on:resize={() => resize()} on:load={() => resize()} />

<canvas
  bind:this={canvas}
  class="absolute inset-0 -z-10 h-full w-full transition duration-1000"
  class:opacity-0={!edges.length}
  style:image-rendering="pixelated"
/>

<slot {elements} />
