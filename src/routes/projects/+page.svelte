<script lang="ts">
  import { page } from "$app/stores";
  import PageRoot from "$components/parts/PageRoot.svelte";
  import { projects } from "$lib/content/projects";
  import { jsonLd } from "$lib/utils";
  import ProjectItem from "./ProjectItem.svelte";

  export let data;
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
      url: project.link,
    })}
  {/each}
</svelte:head>

<PageRoot title="Our Projects" description="Check out our creations and the projects we've tackled along the way!">
  <ul class="grid gap-6 md:px-8 2xl:grid-cols-2">
    {#each Object.values(projects) as project, i (i)}
      <ProjectItem {project} fadeInDelay={i * 0.2} memberMap={data.memberMap} />
    {/each}
  </ul>
</PageRoot>
