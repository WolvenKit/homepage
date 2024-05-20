<script lang="ts">
  import { onMount } from "svelte";

  const RAY_WIDTH = 2;
  const FPS = 14;

  ///// Shared stuff
  export let elements: HTMLElement[] = [];

  ///// Internal variables
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let offscreen: OffscreenCanvas;
  let offCtx: OffscreenCanvasRenderingContext2D;
  let elementImage: ImageData | null = null;
  let origData: Uint8Array | null = null;
  let frame = 0;

  ///// On mount
  onMount(() => {
    ctx = canvas.getContext("2d")!;
    if (!ctx) return;
    offscreen = new OffscreenCanvas(canvas.width, canvas.height);
    offCtx = offscreen.getContext("2d")!;

    resize();
    update();

    return () => window.cancelAnimationFrame(frame);
  });

  ///// Functions
  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    renderContent();
  }

  function renderContent(els: HTMLElement[] = elements) {
    if (!offCtx) return;

    for (const element of els) {
      if (element.tagName === "IMG") {
        // Image rendering
        const image = element as HTMLImageElement;
        if (!image.complete && !image.hasAttribute("data-holoray")) {
          // skip unloaded image
          image.addEventListener("load", () => renderContent(), { once: true });
          image.setAttribute("data-holoray", "");
          continue;
        }

        offCtx.drawImage(image, image.offsetLeft, image.offsetTop, image.clientWidth, image.clientHeight);
      } else {
        // Text rendering
        const style = window.getComputedStyle(element);
        offCtx.font = style.font;
        offCtx.fillStyle = style.color;
        offCtx.textAlign = "start";
        offCtx.textBaseline = "top";

        const uppercase = style.textTransform.includes("uppercase");
        let text = element.textContent!;
        if (uppercase) text = text.toUpperCase();
        offCtx.fillText(text, element.offsetLeft, element.offsetTop);
      }
    }

    elementImage = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
    origData = new Uint8Array(elementImage.data);
  }

  let resetChance = 0;

  function update() {
    frame = window.requestAnimationFrame(update);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (elementImage) {
      ctx.putImageData(elementImage, 0, 0);

      const i = Math.floor(Math.random() * elementImage.data.length);
      const remain = elementImage.data.length - i;
      const da = elementImage.data.slice(
        i,
        i + Math.floor(Math.random() * Math.min(elementImage.width * 16 * 3, remain)),
      );
      const q = Math.floor(Math.random() * (elementImage.data.length - da.length) * 0.9);
      for (let i = 0; i < da.length; i++) {
        elementImage.data[i + q] = da[i];
      }
      resetChance += 0.002;

      if (origData && Math.random() < resetChance) {
        for (let i = 0; i < elementImage.data.length; i++) {
          elementImage.data[i] = origData[i];
        }
        resetChance = 0;
      }
    }
  }

  $: renderContent(elements);
</script>

<canvas bind:this={canvas} on:resize={resize} class="absolute inset-0 -z-10 h-full w-full opacity-50" />

<slot {elements} />
