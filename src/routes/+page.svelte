<script lang="ts">
  import malorian from "$assets/malorian-explosion_chart.avif";
  import malorianHEVC from "$assets/malorian-explosion_chart.hevc?url";
  import malorianMP4 from "$assets/malorian-explosion_chart.mp4";
  import malorianAV1 from "$assets/malorian-explosion_chart.webm";
  import blenderAddon from "$assets/projects/blender-addon.png";
  import cet from "$assets/projects/cet.png";
  import wkit from "$assets/projects/wkit.png";
  import { mediaReady } from "$lib/actions/mediaReady";
  import Button from "$lib/elements/Button.svelte";
  import Divider from "$lib/elements/Divider.svelte";
  import Heading from "$lib/elements/Heading.svelte";
  import Image from "$lib/elements/Image.svelte";
  import Card from "$lib/parts/Card.svelte";
  import Section from "$lib/parts/Section.svelte";
  import Socials from "$lib/parts/Socials.svelte";

  let video: HTMLVideoElement;
  let bgLoaded = false;
  let autoplayDisabled = false;

  $: video?.play().catch(() => (autoplayDisabled = true));
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<header class="relative flex min-h-[calc(100svh-4rem)] flex-col items-center" on:click={() => video?.play()}>
  <div class="dots absolute inset-0 -top-16 -z-10 overflow-hidden bg-red/50">
    <div
      class="dots-wave absolute bottom-0 right-0 top-0 w-[10svw] min-w-32 bg-gradient-to-l from-transparent via-red to-transparent"
    />
  </div>

  <div
    class="absolute -top-16 right-0 max-w-[75svw] bg-red opacity-90 mix-blend-lighten transition max-lg:hidden 2xl:bottom-0"
    class:opacity-0={!bgLoaded}
  >
    <div class="crt absolute inset-0" />
    <video
      bind:this={video}
      use:mediaReady={() => (bgLoaded = true)}
      on:play={() => (autoplayDisabled = false)}
      class="h-full w-full bg-black mix-blend-multiply max-lg:hidden"
      autoplay
      loop
      muted
      playsinline
      disablepictureinpicture
      disableremoteplayback
      preload=""
      poster={malorian}
    >
      <source media="(min-width: 1024px)" src={malorianHEVC} type="video/hevc; codecs=hevc" />
      <source media="(min-width: 1024px)" src={malorianAV1} type="video/webm; codecs=av1" />
      <source media="(min-width: 1024px)" src={malorianMP4} type="video/mp4; codecs=avc1.640028" />
      <Image src={malorian} />
    </video>

    {#if autoplayDisabled}
      <div class="absolute right-0 top-16 p-4 text-lg text-red/90">Auto-play is disabled. Click to play animation.</div>
    {/if}
  </div>

  <div
    class="relative z-10 mx-[5svw] mt-auto flex max-w-screen-2xl flex-wrap items-end justify-center gap-16 pb-16 md:justify-between"
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
        We are a community formed around modding <strong>The Witcher 3</strong>, the release of
        <strong>Cyberpunk 2077</strong> expanded our community dramatically.
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

<style>
  .header-bg {
    --color: color-mix(in srgb, theme("colors.zinc.900") 75%, transparent);
    background-image: radial-gradient(farthest-side, var(--color) 75%, transparent);
    text-shadow: 0.3ex 0.25ex 0.5ex var(--color);
  }

  .crt {
    background-image: radial-gradient(transparent, #000a);
    background-size: 3px 3px;
  }

  .dots {
    mask: radial-gradient(white 0.1rem, transparent 0.2rem),
      radial-gradient(farthest-side at 100% 50%, white, transparent);
    mask-size:
      2rem 2rem,
      100% 100%;
    mask-position: bottom right;
    mask-composite: intersect;
  }

  .dots-wave {
    animation: move-wave 5s infinite linear;
  }

  @keyframes move-wave {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(-100vw);
    }
  }
</style>
