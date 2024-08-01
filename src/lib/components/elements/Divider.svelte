<script lang="ts">
  import { twMerge } from "tailwind-merge";

  let classes = "";
  export { classes as class };
</script>

<div class={twMerge("my-4 flex items-center justify-center gap-2 px-4", classes)}>
  <span class="inline-block size-2 rounded-full bg-red" />
  <span class="inline-block size-2 rounded-full bg-red" />
</div>
