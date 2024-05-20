<script lang="ts" context="module">
  interface CyberspaceContext {
    registerEntity(element: Element): () => void;
    unregisterEntity(element: Element): void;
  }

  const cyberspaceContext = Symbol("CyberSpace");

  export const getCyberspace = () => getContext<CyberspaceContext>(cyberspaceContext);
</script>

<script lang="ts">
  import { getContext, onMount, setContext } from "svelte";

  const KICKSTART_ITERATIONS = 1024;
  const RAY_WIDTH = 2;
  const FPS = 14;

  ///// Shared stuff
  let entities = new Set<Element>();

  const context = setContext<CyberspaceContext>(cyberspaceContext, {
    registerEntity: (el) => entities.add(el) && (() => entities.delete(el)),
    unregisterEntity: (el) => entities.delete(el),
  });

  ///// Internal variables
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  ///// On mount
  onMount(() => {
    ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    resize();

    for (let i = 0; i < KICKSTART_ITERATIONS; i++) update();

    const interval = setInterval(update, 1000 / FPS);

    return () => clearInterval(interval);
  });

  ///// Functions
  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  function spawnLine(clear = false) {
    const x = Math.floor((Math.random() * canvas.width) / RAY_WIDTH) * RAY_WIDTH;

    if (clear) {
      ctx.clearRect(x, 0, RAY_WIDTH, canvas.height);
    } else {
      const height = Math.random() * canvas.height;

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(0.9, "cyan");
      ctx.fillStyle = gradient;
      ctx.fillRect(x, 0, RAY_WIDTH, height);
    }
  }

  function update() {
    spawnLine();
    spawnLine();
    spawnLine(true);
    spawnLine(true);
    spawnLine(true);
    spawnLine(true);

    ctx.fillStyle = "#00000011";
    ctx.fillRect(0, 0, canvas.width, canvas.width);
  }
</script>

<svelte:window on:resize={resize} />

<canvas bind:this={canvas} class="fixed inset-0 -z-10 h-full w-full text-cyan" style:image-rendering="pixelated" />

<slot cyberspace={context} />
