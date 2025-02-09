<script lang="ts">
  import type { ComponentProps, Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";
  import Heading from "../elements/Heading.svelte";
  import SEO from "./SEO.svelte";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Props extends ComponentProps<typeof SEO> {
    class?: string;
    hideHeader?: boolean;
    hideDescription?: boolean;
    description?: string;
    descriptionEl?: Snippet;
    children?: Snippet;
    element?: HTMLElement;
  }

  let {
    class: classes = "",
    hideHeader,
    hideDescription,
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
  class={twMerge("relative my-8 flex w-full grow flex-col items-center gap-16 p-2 py-8", classes)}
>
  {#if !hideHeader}
    {#if title}
      <Heading>{title}</Heading>
    {/if}

    {#if restProps.description && !hideDescription}
      <p class="max-w-4xl text-center text-balance">
        {#if descriptionEl}{@render descriptionEl()}{:else}{restProps.description}{/if}
      </p>
    {/if}
  {/if}

  {@render children?.()}
</div>
