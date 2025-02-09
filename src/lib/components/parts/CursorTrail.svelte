<script lang="ts" module>
  import { getContext, setContext, type Snippet } from "svelte";

  const contextKey = "cursor trail context";

  export interface CursorTrailContext {
    toggle(enabled?: boolean): void;
  }

  export const getCursorTrail = () => getContext<CursorTrailContext>(contextKey);
</script>

<script lang="ts">
  import type { Point } from "$lib/utils";

  const DELAY = 50;

  interface Props {
    enabled?: boolean;
    children?: Snippet;
  }

  let { enabled = $bindable(false), children }: Props = $props();

  setContext<CursorTrailContext>(contextKey, {
    toggle: (val) => (enabled = val == undefined ? !enabled : val),
  });

  let lastTime = Date.now();
  let points: Point[] = $state([]);

  function onMouseMove(ev: MouseEvent) {
    if (!enabled) return;

    let now = Date.now();
    if (now - lastTime < DELAY) return;
    lastTime = now;

    points = [...points, [ev.pageX, ev.pageY]];
  }

  function removePoint(index: number) {
    points = [...points.slice(0, index), ...points.slice(index + 1)];
  }
</script>

<svelte:window onmousemove={onMouseMove} />

{#each points as point, i (point)}
  <div
    class="point bg-red pointer-events-none absolute z-50 size-2 rounded-full"
    style:top="{point[1]}px"
    style:left="{point[0]}px"
    onanimationend={() => removePoint(i)}
  ></div>
{/each}

{@render children?.()}

<style>
  .point {
    animation: point 2s;
  }

  @keyframes point {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    10% {
      opacity: 1;
      transform: scale(1.2);
    }
    15% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0.5);
    }
  }
</style>
