<script lang="ts">
  import { twMerge } from "tailwind-merge";

  interface Props {
    withoutCorners?: boolean;
    class?: string;
  }

  let { withoutCorners = false, class: classes = "" }: Props = $props();
</script>

<!-- Adapted from: https://www.thewitcher.com -->

<div
  class={twMerge(
    "relative flex h-0 text-witcher-silver",
    !withoutCorners &&
      "before:-mr-0.5 before:origin-top-right before:rotate-45 after:-ml-0.5 after:origin-top-left after:-rotate-45 pseudo:mt-px pseudo:inline-block pseudo:size-2 pseudo:flex-shrink-0 pseudo:border-2 pseudo:border-current",
    classes,
  )}
>
  <span class="w-full translate-x-px border-t-2 border-current"></span>
  <svg
    version="1.1"
    width="33"
    height="16.85"
    viewBox="0 0 33 16.85"
    xmlns="http://www.w3.org/2000/svg"
    class="-mt-3 max-h-none flex-shrink-0"
  >
    <path
      class="fill-none stroke-current"
      d="m32 12.92h-3.978l-11.57-11.5-11.16 11.5h-4.284"
      stroke="#fff"
      stroke-linecap="square"
      stroke-miterlimit="10"
      stroke-width="2"
    />
    <path
      class="fill-none stroke-current"
      d="m32 7.053-3.848-3.63-11.72 12-11.72-12-3.72 3.5"
      stroke="#fff"
      stroke-miterlimit="10"
      stroke-width="2"
    />
  </svg>
  <span class="w-full -translate-x-px border-t-2 border-current"></span>
</div>
