<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { getCursorTrail } from "../parts/CursorTrail.svelte";

  interface Props {
    class?: string;
  }

  let { class: classes = "" }: Props = $props();

  const cursorTrail = getCursorTrail();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={twMerge("my-4 flex items-center justify-center gap-2 px-4", classes)}
  ondblclick={() => cursorTrail.toggle()}
>
  <span class="inline-block size-2 rounded-full bg-red"></span>
  <span class="inline-block size-2 rounded-full bg-red"></span>
</div>
