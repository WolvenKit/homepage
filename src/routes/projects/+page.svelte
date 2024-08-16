<script lang="ts">
  import { page } from "$app/stores";
  import PageRoot from "$components/parts/PageRoot.svelte";
  import { getProjectLink, projects } from "$lib/content/projects";
  import { jsonLd } from "$lib/utils";
  import ProjectItem from "./ProjectItem.svelte";
</script>

<svelte:head>
  {#each Object.values(projects) as project, i (i)}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html jsonLd({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: project.name,
      applicationCategory: "Modding Tool",
      operatingSystem: "Windows 10",
      description: project.description,
      image: project.image ? $page.url.origin + project.image : undefined,
      screenshot: project.image ? $page.url.origin + project.image : undefined,
      url: getProjectLink(project),
    })}
  {/each}
</svelte:head>

<PageRoot title="Our Projects" description="Stuff we've created and what we work on.">
  <ul class="flex flex-col gap-6">
    {#each Object.values(projects) as project, i (i)}
      <ProjectItem {project} fadeInDelay={i * 0.2} />
    {/each}
  </ul>
</PageRoot>
