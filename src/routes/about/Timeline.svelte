<script lang="ts">
  import { timeline } from "$lib/content/timeline";
</script>

<dl class="grid grid-cols-2 gap-x-8">
  {#each Object.entries(timeline) as [date, item] (date)}
    <dt class="font-sans-default text-right text-base tabular-nums">{new Date(date).toLocaleDateString()}</dt>
    <dd class="text-left text-xl">{item.title}</dd>
  {/each}
</dl>
