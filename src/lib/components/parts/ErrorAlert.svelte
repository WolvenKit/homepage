<script lang="ts">
  import type { Snippet } from "svelte";
  import Warning from "./Warning.svelte";

  interface Props {
    titleText?: string;
    message?: string;
    // eslint-disable-next-line no-undef
    error?: App.Error | undefined;
    title?: Snippet;
    children?: Snippet;
    code?: Snippet;
  }

  let { titleText = "An error has occured.", message = "", error = undefined, title, children, code }: Props = $props();
  $effect(() => {
    if (error) console.error(error);
  });
</script>

<div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
  <Warning />

  <div>
    <div class="text-4xl text-red">
      {#if title}{@render title()}{:else}{titleText}{/if}
    </div>
    <p>
      {#if children}{@render children()}{:else}{message || error?.description || ""}{/if}
    </p>
    <code class="text-sm text-zinc-400">
      {#if code}{@render code()}{:else if error}
        {error.name || "Error"}{#if error.status}
          {error.status}{/if}: {error.message}{#if error.code}: {#if error.errno}{error.errno}
          {/if}{error.code}{/if}
      {/if}
    </code>
  </div>
</div>
