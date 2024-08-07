<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import type { Point } from "$lib/utils";

  export let repeats = 2;
  export let duration = "5s";
  export let maskPos: Point = [100, 50];
  let classes = "";
  export { classes as class };
</script>

<div
  class={twMerge("dots pointer-events-none absolute inset-0 -top-16 -z-10 overflow-hidden bg-red/40", classes)}
  style:--repeats={repeats}
  style:--duration={duration}
  style:--mask-x="{maskPos[0]}%"
  style:--mask-y="{maskPos[1]}%"
>
  <slot><div class="dots-wave absolute inset-0 text-red" /></slot>
</div>

<style>
  .dots {
    mask: radial-gradient(white 0.1rem, transparent 0.2rem),
      radial-gradient(farthest-side at var(--mask-x) var(--mask-y), white, transparent);
    mask-size:
      2rem 2rem,
      100% 100%;
    mask-position: bottom right;
    mask-composite: intersect;
  }

  .dots-wave {
    --size: calc(100% / var(--repeats));
    width: calc(100% + var(--size) * 2);
    background: linear-gradient(to right, transparent 10vw, currentColor, transparent 20vw);
    background-size: calc(var(--size) / 2) 100%;
    animation: move-wave var(--duration) infinite linear;
  }

  @keyframes move-wave {
    from {
      transform: translateX(calc(var(--size) / 4));
    }
    to {
      transform: translateX(calc(var(--size) / -4));
    }
  }
</style>
