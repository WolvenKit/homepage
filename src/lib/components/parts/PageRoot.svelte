<script lang="ts">
  import type { ComponentProps, Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";
  import Heading from "../elements/Heading.svelte";
  import SEO from "./SEO.svelte";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Props extends ComponentProps<typeof SEO> {
    class?: string;
    hideDescription?: boolean;
    description?: string;
    descriptionEl?: Snippet;
    children?: Snippet;
    element?: HTMLElement;
  }

  let {
    class: classes = "",
    hideDescription = false,
    children,
    descriptionEl,
    element = $bindable(),
    ...restProps
  }: Props = $props();

  const title = $derived(
    Array.isArray(restProps.title) ? restProps.title[restProps.title.length - 1] : restProps.title,
  );
</script>

<SEO {...restProps} />

<div
  bind:this={element}
  class={twMerge("relative my-8 flex w-full flex-grow flex-col items-center gap-16 p-2 py-8", classes)}
>
  {#if title}
    <Heading>{title}</Heading>
  {/if}

  {#if restProps.description && !hideDescription}
    <p class="max-w-3xl text-balance text-center">
      {#if descriptionEl}{@render descriptionEl()}{:else}{restProps.description}{/if}
    </p>
  {/if}

  {@render children?.()}
</div>
