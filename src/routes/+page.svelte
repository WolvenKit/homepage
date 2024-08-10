<script lang="ts">
  import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons/faAnglesLeft";
  import { faAnglesRight } from "@fortawesome/free-solid-svg-icons/faAnglesRight";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { twMerge } from "tailwind-merge";
  import Button from "$components/elements/Button.svelte";
  import Divider from "$components/elements/Divider.svelte";
  import Heading from "$components/elements/Heading.svelte";
  import Image from "$components/elements/Image.svelte";
  import Section from "$components/parts/Section.svelte";
  import Socials from "$components/parts/Socials.svelte";
  import ThemeButton from "$components/theme/ThemeButton.svelte";
  import { projects, getProjectLink } from "$lib/content/projects";
  import HeroBackground from "./HeroBackground.svelte";

  let video: HTMLVideoElement;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<header class="relative flex min-h-[calc(100svh-4rem)] flex-col items-center" on:click={() => video?.play()}>
  <HeroBackground bind:video fadeDelay={1} />

  <div
    class="relative z-10 mx-[5vw] mt-auto flex max-w-screen-2xl flex-wrap items-end justify-between gap-2 pb-4 pt-16 max-v-md:flex-grow v-md:gap-8 max-sm:flex-col md:pb-16 lg:gap-16"
  >
    <div class="w-full text-5xl font-bold uppercase text-zinc-200 sm:text-6xl">
      <div class="header-bg relative -ml-1 inline-block" style:--fade-duration="1s">
        <span class="fade-in" style:--fade-delay="0.1s">Community of</span>
        <div class="-ml-0.5 text-7xl text-red sm:text-8xl">
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
    {@const link = getProjectLink(project)}
    <div
      class={twMerge(
        "flex w-full max-w-[1920px] flex-wrap gap-x-16 gap-y-8 bg-zinc-950 p-8 md:px-16",
        i % 2 && "bg-zinc-900 md:flex-row-reverse md:text-right",
      )}
    >
      <Image src={project.image} class="h-full max-h-96 w-auto sm:max-w-[75vw] md:max-w-[50vw] lg:max-w-[40vw]" />

      <div class="flex flex-grow flex-col gap-4 md:items-start" class:md:items-end={i % 2}>
        <div class="my-auto">
          <h3 class="text-4xl font-semibold sm:text-6xl md:text-7xl">{project.name}</h3>
          <p class="md:text-4xl">{project.description}</p>
        </div>

        {#if link}
          <ThemeButton href={link[1]}>Visit project</ThemeButton>
        {/if}
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
    --color: color-mix(in srgb, theme("colors.zinc.900") 75%, transparent);
    background-image: radial-gradient(farthest-side, var(--color) 75%, transparent);
    text-shadow: 0.3ex 0.25ex 0.5ex var(--color);
  }
</style>
