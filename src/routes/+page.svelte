<script lang="ts">
  import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons/faAnglesLeft";
  import { faAnglesRight } from "@fortawesome/free-solid-svg-icons/faAnglesRight";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";
  import Button from "$components/elements/Button.svelte";
  import Divider from "$components/elements/Divider.svelte";
  import Heading from "$components/elements/Heading.svelte";
  import LazyImage from "$components/elements/LazyImage.svelte";
  import Seo from "$components/parts/SEO.svelte";
  import Section from "$components/parts/Section.svelte";
  import Socials from "$components/parts/Socials.svelte";
  import ThemeButton from "$components/theme/ThemeButton.svelte";
  import { projects } from "$lib/content/projects";
  import HeroBackground from "./HeroBackground.svelte";

  let video: HTMLVideoElement | undefined = $state();
  let clicks = $state(0);

  function onClick() {
    clicks++;
    video?.play();
  }
</script>

<Seo />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<header class="relative flex min-h-[calc(100svh-4rem)] flex-col items-center" onclick={onClick}>
  <HeroBackground bind:video fadeDelay={0.5} rainbow={clicks > 16} />

  <div
    class="max-v-md:grow v-md:gap-8 relative z-10 mx-[5vw] mt-auto flex max-w-(--breakpoint-2xl) flex-wrap items-end justify-between gap-2 pt-16 pb-4 max-sm:flex-col md:pb-16 lg:gap-16"
  >
    <div class="w-full text-5xl font-bold text-zinc-200 uppercase sm:text-6xl">
      <div class="header-bg relative -ml-1 inline-block" style:--fade-duration="1s">
        <span class="fade-in" style:--fade-delay="0.1s">Community of</span>
        <div class="text-red -ml-0.5 text-7xl sm:text-8xl">
          <span class="fade-in" style:--fade-delay="0.3s">RED<span class="text-zinc-400">engine</span> </span>
          <span class="fade-in" style:--fade-delay="0.4s">modding</span>
        </div>
        <span class="fade-in" style:--fade-delay="0.6s">enthusiasts</span>
      </div>
    </div>

    <div class="fade-in" style:--fade-delay="0.8s">
      <Divider class="justify-start" />
      <p class="header-bg max-w-3xl text-left text-2xl">
        We are a community formed around modding <strong>The Witcher 3</strong>, significantly expanded by the release
        of <strong>Cyberpunk 2077</strong>.
        <Button inline href="/about">Read more...</Button>
      </p>
    </div>

    <Socials class="header-bg" />
  </div>
</header>

<!-- <Section>
  <Card horizontal title="Check out our wiki!" href="https://wiki.redmodding.org">
    <span slot="logo" class="p-4 px-6 text-7xl font-bold text-red">wiki</span>

    Our wiki is a community-driven collection of guides for modding and documentation about our tools.
  </Card>
</Section> -->

<Section class="gap-0 p-0">
  <Heading level={2} class="mb-8">Featured Projects</Heading>

  {#each Object.values(projects).filter((v) => v.featured) as project, i (i)}
    <div class={twMerge("w-full bg-zinc-950", i % 2 && "bg-zinc-900")}>
      <div
        class={twMerge(
          "mx-auto flex w-full max-w-[1920px] gap-x-16 gap-y-8 p-8 max-lg:flex-col md:px-16",
          i % 2 && "md:text-right lg:flex-row-reverse",
        )}
      >
        <LazyImage
          src={project.image}
          width="720"
          height="405"
          class="h-full max-h-96 w-auto sm:max-w-[75vw] md:max-w-[50vw] lg:max-w-[40vw]"
          alt={project.name}
        />

        <div class="flex grow flex-col gap-4 md:items-start" class:md:items-end={i % 2}>
          <div class="my-auto">
            <h3 class="text-3xl font-semibold sm:text-5xl md:text-6xl">{project.name}</h3>
            <p class="md:text-2xl">{project.description}</p>
          </div>

          {#if project.link}
            <ThemeButton href={project.link}>Visit project</ThemeButton>
          {/if}
        </div>
      </div>
    </div>
  {/each}

  <Button href="/projects" class="mt-8 text-3xl">
    <FontAwesomeIcon icon={faAnglesRight} />
    See all projects
    <FontAwesomeIcon icon={faAnglesLeft} />
  </Button>
</Section>

<style>
  .header-bg {
    --color: color-mix(in srgb, var(--colors-zinc-900) 75%, transparent);
    background-image: radial-gradient(farthest-side, var(--color) 75%, transparent);
    text-shadow: 0.3ex 0.25ex 0.5ex var(--color);
  }
</style>
