<script lang="ts">
  import type { SVGAttributes } from "svelte/elements";
  import { scalePath, THEME_CORNERS, type Theme } from "$lib/themes";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface $$Props extends SVGAttributes<SVGElement> {
    theme: Theme;
    scale?: number;
  }

  export let theme: Theme;
  export let scale = 1;

  $: points =
    scale == 1 || !THEME_CORNERS[theme]
      ? THEME_CORNERS[theme]?.points
      : scalePath(THEME_CORNERS[theme]!.points ?? [], scale);
</script>

<svg version="1.1" viewBox="-1 -1 17 17" xmlns="http://www.w3.org/2000/svg" width={17} height={17} {...$$restProps}>
  <polyline
    points={points?.map((p) => p.join(",")).join(" ")}
    class="fill-none stroke-current"
    stroke-linecap="square"
    stroke-width="2"
  />
</svg>
