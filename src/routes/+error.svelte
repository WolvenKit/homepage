<script>
  import { page } from "$app/stores";
  import Heading from "$components/elements/Heading.svelte";
  import Section from "$components/parts/Section.svelte";
</script>

<Section class="mt-16">
  <Heading level={1}>{$page.status}</Heading>
  <Heading level={2} class="-mt-8">{$page.error?.message}</Heading>
</Section>
