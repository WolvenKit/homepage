<script lang="ts">
  import Heading from "$lib/components/elements/Heading.svelte";
  import Section from "$lib/components/parts/Section.svelte";

  export let data;
</script>

<Section>
  <Heading>{data.member.Displayname}</Heading>
</Section>
