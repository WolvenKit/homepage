<script lang="ts">
  import { twMerge } from "tailwind-merge";

  export let key = "";
  export let value = "";
  let classes = "";
  export { classes as class };
</script>

<div class={twMerge("flex flex-col items-center justify-between", classes)}>
  <dt class="font-semibold uppercase"><slot name="key">{key}</slot></dt>
  <dd class="text-xl"><slot>{value}</slot></dd>
</div>
