<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { THEME_COLORS, type Theme } from "$lib/themes";
  import { tw } from "$lib/utils";

  export let theme: Theme = "default";
  export let size: keyof typeof SIZES = "lg";
  export let href = "";
  export let external = !href.startsWith("/");
  export let label = "";
  let classes = "";
  export { classes as class };

  const SIZES = {
    lg: tw`px-4 py-2`,
    sm: tw`px-2 py-1`,
  };

  const THEME: Record<Theme, string> = {
    default: "",
    cyberpunk: tw`bg-red-darkest hover-focus:bg-red-darker`,
    witcher: tw`border p-1`,
  };
</script>

<svelte:element
  this={href ? "a" : "button"}
  {href}
  rel={external ? "noopener noreferrer" : undefined}
  target={external ? "_blank" : undefined}
  title={label || undefined}
  class={twMerge(
    "relative border-2 text-center font-semibold uppercase leading-none",
    "transition hover-focus:bg-zinc-700 hover-focus:text-white",
    THEME_COLORS[theme ?? "default"].border.border,
    SIZES[size],
    THEME[theme],
    classes,
  )}
>
  <slot>{label}</slot>
</svelte:element>
