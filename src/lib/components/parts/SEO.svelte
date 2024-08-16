<script lang="ts">
  import { page } from "$app/stores";
  import screenshot from "$assets/screenshot.webp";
  import { site } from "$lib/content/site";

  export let title: string | string[] = "";
  export let description = site.description;
  export let image = screenshot;
  export let type: "website" | "article" | "profile" = "website";
  export let card: "summary" | "summary_large_image" = "summary_large_image";

  const joinTitle = (...parts: (string | string[])[]) =>
    parts
      .flat()
      .filter((v) => v)
      .join(" • ");

  $: titleBase = joinTitle(title);
  $: titleFull = joinTitle(title, site.name);
  $: url = $page.url.origin + $page.url.pathname;
  $: _image = image.startsWith("/") ? $page.url.origin + image : image;
</script>

<svelte:head>
  <title>{titleFull}</title>
  <link rel="canonical" href={url} />
  <meta name="description" content={description} />

  <meta property="og:site_name" content={site.name} />
  <meta property="og:title" content={titleBase} />
  <meta property="og:type" content={type} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={_image} />

  <meta name="twitter:site" content={site.name} />
  <meta name="twitter:title" content={titleBase} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:card" content={card} />
  <meta name="twitter:image:src" content={_image} />

  <meta name="theme-color" content={site.color} />
</svelte:head>
