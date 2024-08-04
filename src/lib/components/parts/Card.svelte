<script lang="ts">
  import { twMerge } from "tailwind-merge";

  export let horizontal = false;
  export let overlay = !horizontal;
  export let href = "";
  export let external = !href.startsWith("/");
  export let title = "";
</script>

<a
  {href}
  rel={external ? "noopener noreferrer" : undefined}
  target={external ? "_blank" : undefined}
  class="group relative flex flex-wrap overflow-hidden bg-zinc-950 shadow-lg transition hover-focus:shadow-red"
  class:flex-col={!horizontal}
>
  <div
    class={twMerge(
      "flex min-h-8 w-full max-w-md flex-1 items-center justify-center",
      overlay && "blur-sm transition group-hover-focus:blur-none",
    )}
  >
    <div class={twMerge("h-full w-full transition", "saturate-50 group-hover-focus:saturate-100")}>
      <slot name="logo" />
    </div>
  </div>

  <div
    class={twMerge(
      "relative max-w-md px-4 py-2 text-center transition",
      overlay &&
        "text-shadow absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/25 group-hover-focus:bg-transparent",
    )}
  >
    {#if $$slots.title || title}
      <h3 class="mb-1 text-2xl font-bold uppercase text-white">
        <slot name="title">{title}</slot>
      </h3>
    {/if}

    <slot name="content">
      <p class="text-shadow text-center leading-tight">
        <slot />
      </p>
    </slot>
  </div>
</a>
