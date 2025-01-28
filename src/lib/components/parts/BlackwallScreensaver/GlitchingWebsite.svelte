<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import type { Point } from "$lib/utils";
  import { GlitchRenderer, type GlitchRendererOptions } from "./GlitchRenderer";
  import { renderElement } from "./renderer";

  interface Props extends Partial<GlitchRendererOptions> {
    updateChance?: number;
    class?: string;
    rootElement?: HTMLElement;
  }

  let {
    updateChance = 0.7,
    class: classes = "",
    rootElement = browser ? document.body : undefined,
    ...options
  }: Props = $props();

  let canvas: HTMLCanvasElement | undefined = $state();
  let gl: WebGLRenderingContext | undefined = $state();
  let glitchRenderer: GlitchRenderer;

  let offscreen: OffscreenCanvas;
  let offCtx: OffscreenCanvasRenderingContext2D;

  let animFrame = 0;

  onMount(() => {
    // eslint-disable-next-line no-undef
    const glOptions: WebGLContextAttributes = { preserveDrawingBuffer: true, failIfMajorPerformanceCaveat: true };
    gl = canvas?.getContext("webgl2", glOptions) || undefined;
    if (!gl) {
      gl = canvas?.getContext("webgl", glOptions) || undefined;
      if (!gl) return; // give up
    }

    glitchRenderer = new GlitchRenderer(gl, options);

    offscreen = new OffscreenCanvas(0, 0);
    offCtx = offscreen.getContext("2d")!;

    update();

    return () => animFrame && window.cancelAnimationFrame(animFrame);
  });

  async function resize(rerender = true) {
    if (!canvas || !offscreen) return;
    canvas.width = Math.min(rootElement?.clientWidth || Number.POSITIVE_INFINITY, window.innerWidth);
    canvas.height = Math.min(rootElement?.clientHeight || Number.POSITIVE_INFINITY, window.innerHeight);
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;

    glitchRenderer.resize(canvas.width, canvas.height);
    if (rerender) await render();
  }

  async function render() {
    await renderElement(offCtx, rootElement || document.body, rootOffset, true);

    glitchRenderer.setSource(offscreen);
  }

  function update() {
    animFrame = window.requestAnimationFrame(update);

    if (!gl || Math.random() > updateChance) return;

    glitchRenderer.update();
  }

  let rootBbox = $derived(rootElement?.getBoundingClientRect());
  let rootOffset = $derived([rootBbox?.left || 0, rootBbox?.top || 0] as Point);
  $effect.pre(() => {
    if (gl && rootElement) resize(true).catch(console.error);
  });
</script>

<svelte:window onresize={() => resize()} />

<canvas bind:this={canvas} class={classes} inert></canvas>
