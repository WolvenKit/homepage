<script lang="ts">
  import { twMerge } from "tailwind-merge";

  type Level = 1 | 2 | 3;

  const LEVELS = {
    1: "text-5xl uppercase text-white font-bold",
    2: "text-4xl uppercase text-zinc-300",
    3: "",
  } satisfies Record<Level, string>;

  export let level: Level = 1;
  let classes = "";
  export { classes as class };
</script>

<h2 class={twMerge("-mb-8", LEVELS[level], classes)}><slot></slot></h2>
