<script lang="ts">
  import { page } from "$app/state";
  import screenshot from "$assets/screenshot.webp";
  import { PUBLIC_IMAGE_URL_PREFIX } from "$env/static/public";
  import { site } from "$lib/content/site";

  interface Props {
    title?: string | string[];
    description?: string;
    image?: string;
    type?: "website" | "article" | "profile";
    card?: "summary" | "summary_large_image";
  }

  let {
    title = "",
    description = site.description,
    image = screenshot,
    type = "website",
    card = "summary_large_image",
  }: Props = $props();

  const joinTitle = (...parts: (string | string[])[]) =>
    parts
      .flat()
      .filter((v) => v)
      .join(" • ");

  function mask(url: string) {
    if (PUBLIC_IMAGE_URL_PREFIX) return PUBLIC_IMAGE_URL_PREFIX + url;
    return url;
  }

  let titleBase = $derived(joinTitle(title));
  let titleFull = $derived(joinTitle(title, site.name));
  let url = $derived(page.url.origin + page.url.pathname);
  let _image = $derived(image.startsWith("/") ? page.url.origin + image : mask(image));
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
  <meta name="twitter:image" content={_image} />

  <meta name="theme-color" content={site.color} />
</svelte:head>
