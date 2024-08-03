<script lang="ts">
  import Heading from "$components/elements/Heading.svelte";
  import Section from "$components/parts/Section.svelte";
  import { projects } from "$lib/content/projects";
</script>

<Section>
  <Heading>Our Projects</Heading>

  <p class="max-w-3xl text-center">Stuff we've created and what we work on.</p>

  <ul>
    {#each Object.entries(projects) as [projectId, project], i (i)}
      <li>
        {project.name} &ndash;
        {project.description}
      </li>
    {/each}
  </ul>
</Section>
