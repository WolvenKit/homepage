<script lang="ts">
  import type { ComponentProps } from "svelte";
  import { twMerge } from "tailwind-merge";
  import Heading from "../elements/Heading.svelte";
  import SEO from "./SEO.svelte";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface $$Props extends ComponentProps<SEO> {
    class?: string;
    hideDescription?: boolean;
  }

  export let hideDescription = false;
  let classes = "";
  export { classes as class };

  $: title = Array.isArray($$props.title) ? $$props.title[$$props.title.length - 1] : $$props.title;
</script>

<SEO {...$$restProps} />

<div class={twMerge("relative my-8 flex w-full flex-grow flex-col items-center gap-16 p-2 py-8", classes)}>
  {#if title}
    <Heading><slot name="title">{title}</slot></Heading>
  {/if}

  {#if $$props.description && !hideDescription}
    <p class="max-w-3xl text-balance text-center"><slot name="description">{$$props.description}</slot></p>
  {/if}

  <slot></slot>
</div>
