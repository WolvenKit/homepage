<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { getCursorTrail } from "../parts/CursorTrail.svelte";

  let classes = "";
  export { classes as class };

  const cursorTrail = getCursorTrail();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={twMerge("my-4 flex items-center justify-center gap-2 px-4", classes)}
  on:dblclick={() => cursorTrail.toggle()}
>
  <span class="inline-block size-2 rounded-full bg-red" />
  <span class="inline-block size-2 rounded-full bg-red" />
</div>
