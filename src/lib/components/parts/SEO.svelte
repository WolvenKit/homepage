<script lang="ts">
  import { page } from "$app/stores";
  import { site } from "$lib/content/site";

  export let title: string | string[] = "";
  export let description = site.description;
  export let image = "/screenshot.webp";

  $: _title = [title, site.name]
    .flat()
    .filter((v) => v)
    .join(" | ");
  $: url = $page.url.origin + $page.url.pathname;
</script>

<svelte:head>
  <title>{_title}</title>
  <meta name="description" content={description} />

  <meta property="og:title" content={_title} />
  <meta property="og:type" content="website" />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta name="twitter:card" content="summary" />

  <meta property="og:image" content={$page.url.origin + image} />

  <meta name="theme-color" content={site.color} />

  <!-- Locale links -->
  <link rel="canonical" href={url} />
</svelte:head>
