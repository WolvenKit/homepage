<script lang="ts">
  import { page } from "$app/stores";
  import { site } from "$lib/content/site";

  export let title: string | string[] = "";
  export let description = site.description;
  export let image = "/screenshot.webp";
  export let type: "website" | "article" | "profile" = "website";
  export let card: "summary" | "summary_large_image" = "summary_large_image";

  $: _title = [title, site.name]
    .flat()
    .filter((v) => v)
    .join(" | ");
  $: url = $page.url.origin + $page.url.pathname;
</script>

<svelte:head>
  <title>{_title}</title>
  <link rel="canonical" href={url} />
  <meta name="description" content={description} />

  <meta property="og:site_name" content={site.name} />
  <meta property="og:title" content={_title} />
  <meta property="og:type" content={type} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={$page.url.origin + image} />

  <meta name="twitter:site" content={site.name} />
  <meta name="twitter:title" content={_title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:card" content={card} />
  <meta name="twitter:image:src" content={$page.url.origin + image} />

  <meta name="theme-color" content={site.color} />
</svelte:head>
