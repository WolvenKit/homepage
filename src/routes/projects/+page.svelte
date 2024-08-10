<script lang="ts">
  import Heading from "$components/elements/Heading.svelte";
  import Section from "$components/parts/Section.svelte";
  import { projects } from "$lib/content/projects";
  import ProjectItem from "./ProjectItem.svelte";
</script>

<Section>
  <Heading>Our Projects</Heading>

  <p class="max-w-3xl text-center">Stuff we've created and what we work on.</p>

  <ul class="flex flex-col gap-6">
    {#each Object.values(projects) as project, i (i)}
      <ProjectItem {project} fadeInDelay={i * 0.2} />
    {/each}
  </ul>
</Section>
