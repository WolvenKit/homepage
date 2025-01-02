<script lang="ts">
  import type { SVGAttributes } from "svelte/elements";
  import { THEME_CORNERS, type Theme } from "$lib/themes";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  interface Props extends SVGAttributes<SVGElement> {
    theme: Theme;
    scale?: number;
  }

  let { theme, scale = 1, ...rest }: Props = $props();
</script>

<svg
  version="1.1"
  viewBox="-0.5 -0.5 17 17"
  xmlns="http://www.w3.org/2000/svg"
  width={17 * scale}
  height={17 * scale}
  vector-effect="non-scaling-stroke"
  {...rest}
>
  <polyline
    points={THEME_CORNERS[theme]?.points.map((p) => p.join(",")).join(" ")}
    class="fill-none stroke-current"
    stroke-linecap="square"
    vector-effect="non-scaling-stroke"
    stroke-width="2"
  />
</svg>
