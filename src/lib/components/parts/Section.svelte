<script lang="ts">
  import { twMerge } from "tailwind-merge";

  let classes = "";
  export { classes as class };
</script>

<section class={twMerge("my-8 flex w-full flex-grow flex-col items-center gap-16 p-2 py-8", classes)}>
  <slot></slot>
</section>
