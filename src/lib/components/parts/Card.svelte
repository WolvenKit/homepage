<script lang="ts">
  import type { Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";

  interface Props {
    href?: string;
    external?: boolean;
    titleText?: string;
    class?: string;
    title?: Snippet;
    logo?: Snippet;
    content?: Snippet;
    children?: Snippet;
  }

  const { href = "", titleText = "", class: classes = "", logo, title, content, children, ...props }: Props = $props();

  const external = $derived(props.external ?? !href.startsWith("/"));
</script>

<a
  {href}
  rel={external ? "noopener noreferrer" : undefined}
  target={external ? "_blank" : undefined}
  class={twMerge(
    "group hover-focus:shadow-red relative flex w-min flex-col overflow-hidden bg-zinc-950 shadow-lg transition",
    classes,
  )}
>
  <div class="min-h-8 w-max max-w-md">
    <div class="w-max transition">
      {@render logo?.()}
    </div>
  </div>

  <div class="relative max-w-full flex-1 px-4 py-2 transition">
    {#if title || titleText}
      <h3 class="mb-1 max-w-full text-2xl font-bold text-white uppercase">
        {#if title}{@render title()}{:else}{titleText}{/if}
      </h3>
    {/if}

    {#if content}
      {@render content()}
    {:else}
      <p class="text-shadow max-w-full leading-tight">
        {@render children?.()}
      </p>
    {/if}
  </div>
</a>
