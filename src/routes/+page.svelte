<script lang="ts">
  import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord";
  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
  import { faPatreon } from "@fortawesome/free-brands-svg-icons/faPatreon";
  import cet from "$assets/cet.png";
  import malorianHEVC from "$assets/malorian-explosion_chart.hevc.mp4";
  import malorianMP4 from "$assets/malorian-explosion_chart.mp4";
  import malorian from "$assets/malorian-explosion_chart.png";
  import malorianAV1 from "$assets/malorian-explosion_chart.webm";
  import wkit from "$assets/wkit.png";
  import { mediaReady } from "$lib/actions/mediaReady";
  import Button from "$lib/elements/Button.svelte";
  import Divider from "$lib/elements/Divider.svelte";
  import Image from "$lib/elements/Image.svelte";
  import Title from "$lib/elements/Title.svelte";
  import Card from "$lib/parts/Card.svelte";
  import Section from "$lib/parts/Section.svelte";

  let video: HTMLVideoElement;
  let bgLoaded = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<header class="relative flex min-h-[calc(100svh-7rem)] flex-col" on:click={() => video?.play()}>
  <div
    class="absolute -top-28 bottom-0 right-0 -z-10 max-w-screen-xl bg-red opacity-90 mix-blend-lighten transition"
    class:opacity-0={!bgLoaded}
  >
    <div class="dots absolute inset-0" />
    <video
      bind:this={video}
      use:mediaReady={() => (bgLoaded = true)}
      class="h-full w-full bg-black mix-blend-multiply"
      autoplay
      loop
      muted
      playsinline
      disablepictureinpicture
      disableremoteplayback
      preload=""
      poster={malorian}
    >
      <source src={malorianHEVC} type="video/mp4; codecs=hevc" />
      <source src={malorianAV1} type="video/webm; codecs=av1" />
      <source src={malorianMP4} type="video/mp4; codecs=avc1.640028" />
      <Image src={malorian} />
    </video>
  </div>

  <div class="mx-auto mt-auto flex max-w-screen-2xl flex-wrap items-end justify-between gap-16 pb-16">
    <div class="w-full text-6xl font-bold uppercase text-zinc-200">
      <div class="header-bg inline-block">
        Community of
        <div class="-ml-0.5 text-8xl text-red">
          RED<span class="text-zinc-400">engine</span> modding
        </div>
        enthusiasts
      </div>
    </div>

    <div>
      <Divider class="justify-start" />
      <p class="max-w-3xl text-left text-2xl">
        We are a community formed around modding <strong>The Witcher 3</strong>, the release of
        <strong>Cyberpunk 2077</strong> expanded our community dramatically.
        <Button inline href="/about">Read more...</Button>
      </p>
    </div>

    <nav>
      <div class="text-md text-center uppercase text-zinc-400">FIND US ON</div>
      <ul class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <li>
          <Button href="https://github.com/WolvenKit/" icon={faGithub}>GitHub</Button>
        </li>
        <li>
          <Button href="https://discord.com/invite/Epkq79kd96" icon={faDiscord}>Discord</Button>
        </li>
        <li>
          <Button href="https://www.patreon.com/RedModdingTools" icon={faPatreon}>Patreon</Button>
        </li>
      </ul>
    </nav>
  </div>
</header>

<!-- <Section>
  <Card horizontal title="Check out our wiki!" href="https://wiki.redmodding.org">
    <span slot="logo" class="p-4 px-6 text-7xl font-bold text-red">wiki</span>

    Our wiki is a community-driven collection of guides for modding and documentation about our tools.
  </Card>
</Section> -->

<Section class="bg-zinc-950">
  <Title>Our Main Projects</Title>

  <nav class="flex flex-wrap justify-center gap-4">
    <Card title="WolvenKit" href="https://github.com/WolvenKit/WolvenKit/releases/latest">
      <Image slot="logo" src={wkit} />

      Community mod editor/creator for REDengine games.
    </Card>

    <Card title="Cyber Engine Tweaks" href="https://github.com/maximegmd/CyberEngineTweaks/releases/latest">
      <Image slot="logo" src={cet} />
      Cyberpunk 2077 tweaks, hacks and scripting framework.
    </Card>
  </nav>
</Section>

<style>
  .header-bg {
    --color: color-mix(in srgb, theme("colors.zinc.900"), transparent);
    background: radial-gradient(farthest-side, var(--color) 75%, transparent);
  }

  .dots {
    background: radial-gradient(transparent, #000a);
    background-size: 3px;
  }
</style>
