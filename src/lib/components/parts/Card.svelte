<script lang="ts">
  import { twMerge } from "tailwind-merge";

  export let href = "";
  export let external = !href.startsWith("/");
  export let title = "";
  let classes = "";
  export { classes as class };
</script>

<a
  {href}
  rel={external ? "noopener noreferrer" : undefined}
  target={external ? "_blank" : undefined}
  class={twMerge(
    "group relative flex w-min flex-col overflow-hidden bg-zinc-950 shadow-lg transition hover-focus:shadow-red",
    classes,
  )}
>
  <div class="min-h-8 w-max max-w-md">
    <div class="w-max transition">
      <slot name="logo" />
    </div>
  </div>

  <div class="relative max-w-full flex-1 px-4 py-2 transition">
    {#if $$slots.title || title}
      <h3 class="mb-1 max-w-full text-2xl font-bold uppercase text-white">
        <slot name="title">{title}</slot>
      </h3>
    {/if}

    <slot name="content">
      <p class="text-shadow max-w-full leading-tight">
        <slot />
      </p>
    </slot>
  </div>
</a>
