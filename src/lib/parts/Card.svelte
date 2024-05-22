<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import Panel from "./Panel.svelte";

  export let horizontal = false;
  export let href = "";
  export let external = !href.startsWith("/");
  export let title = "";
</script>

<a
  {href}
  rel={external ? "noopener noreferrer" : undefined}
  target={external ? "_blank" : undefined}
  class="hover-glow group relative flex flex-wrap p-1 transition"
  class:flex-col={!horizontal}
>
  <Panel slant={34} class="group-hover:bg-cyan-dark" />

  <Panel slant={32} class="static flex min-h-8 w-full max-w-md flex-1 items-center justify-center">
    <slot name="logo" />
  </Panel>

  <div class={twMerge("relative max-w-md border-4 border-transparent bg-slate-900 px-4 py-2 transition")}>
    {#if $$slots.title || title}
      <h3 class="mb-1 text-2xl font-bold uppercase text-cyan">
        <slot name="title">{title}</slot>
      </h3>
    {/if}

    <slot name="content">
      <p class="text-justify leading-tight">
        <slot />
      </p>
    </slot>
  </div>
</a>
