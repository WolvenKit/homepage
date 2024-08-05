<script lang="ts">
  import blenderAddon from "$assets/projects/blender-addon.png";
  import cet from "$assets/projects/cet.png";
  import wkit from "$assets/projects/wkit.png";
  import Button from "$components/elements/Button.svelte";
  import Divider from "$components/elements/Divider.svelte";
  import Heading from "$components/elements/Heading.svelte";
  import Image from "$components/elements/Image.svelte";
  import Card from "$components/parts/Card.svelte";
  import DotsBackground from "$components/parts/DotsBackground.svelte";
  import Section from "$components/parts/Section.svelte";
  import Socials from "$components/parts/Socials.svelte";
  import HeroBackground from "./HeroBackground.svelte";

  let video: HTMLVideoElement;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<header class="relative flex min-h-[calc(100svh-4rem)] flex-col items-center" on:click={() => video?.play()}>
  <DotsBackground />

  <HeroBackground bind:video />

  <div
    class="relative z-10 mx-[5vw] mt-auto flex max-w-screen-2xl flex-wrap items-end justify-between gap-2 pb-4 pt-16 max-v-md:flex-grow v-md:gap-8 max-sm:flex-col md:pb-16 lg:gap-16"
  >
    <div class="w-full text-5xl font-bold uppercase text-zinc-200 sm:text-6xl">
      <div class="header-bg relative -ml-1 inline-block">
        Community of
        <div class="-ml-0.5 text-7xl text-red sm:text-8xl">
          RED<span class="text-zinc-400">engine</span> modding
        </div>
        enthusiasts
      </div>
    </div>

    <div>
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

<Section class="m-0 bg-zinc-950">
  <Heading level={2}>Our Main Projects</Heading>

  <nav class="flex flex-wrap justify-center gap-4">
    <Card title="WolvenKit" href="https://github.com/WolvenKit/WolvenKit/releases/latest">
      <Image slot="logo" src={wkit} />

      Community mod editor/creator for REDengine games.
    </Card>

    <Card title="Cyber Engine Tweaks" href="https://github.com/maximegmd/CyberEngineTweaks/releases/latest">
      <Image slot="logo" src={cet} />
      Cyberpunk 2077 tweaks, hacks and scripting framework.
    </Card>

    <Card title="Cyberpunk Blender Add-on" href="https://github.com/WolvenKit/Cyberpunk-Blender-add-on/releases">
      <Image slot="logo" src={blenderAddon} />
      Bridging the gap between WolvenKit and Blender.
    </Card>
  </nav>
</Section>

<Section>Don't forget to put something here.</Section>

<style>
  .header-bg {
    --color: color-mix(in srgb, theme("colors.zinc.900") 75%, transparent);
    background-image: radial-gradient(farthest-side, var(--color) 75%, transparent);
    text-shadow: 0.3ex 0.25ex 0.5ex var(--color);
  }
</style>
