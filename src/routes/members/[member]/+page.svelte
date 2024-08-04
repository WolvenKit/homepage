<script lang="ts">
  import Heading from "$lib/components/elements/Heading.svelte";
  import Image from "$lib/components/elements/Image.svelte";
  import Section from "$lib/components/parts/Section.svelte";

  export let data;
</script>

<Section>
  <Heading>Member detail</Heading>

  <div>
    <Image src={data.member.Image} width={128} height={128} />
  </div>
</Section>
