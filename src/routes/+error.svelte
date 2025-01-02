<script>
  import { page } from "$app/state";
  import catStare from "$assets/cat_blank_stare.webp";
  import catFine from "$assets/cat_fine.webp";
  import catLove from "$assets/cat_love.webp";
  import Button from "$components/elements/Button.svelte";
  import GlitchingImage from "$components/elements/GlitchingImage.svelte";
  import Heading from "$components/elements/Heading.svelte";
  import ErrorAlert from "$components/parts/ErrorAlert.svelte";
  import Section from "$components/parts/Section.svelte";

  const IMAGES = [catFine, catFine, catFine, catStare, catStare, catLove];

  let image = $derived(IMAGES[Math.floor((page.data.rand ?? 0) * IMAGES.length)]);
</script>

<Section class="mt-16">
  <ErrorAlert error={page.error || undefined}>
    {#snippet title()}
      <Heading level={1} class="m-0 -ml-0.5 text-inherit">
        Error {page.status}{#if page.error}: {page.error?.message}{/if}
      </Heading>
    {/snippet}

    {#if page.error?.description}
      {page.error?.description}
    {:else if page.status == 404}
      The page you're trying to visit does not exit. Check if the URL is correct or
      <Button inline href="/">go home</Button>.
    {/if}
  </ErrorAlert>

  <GlitchingImage src={image} />
</Section>
