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
  import Image from "$lib/elements/Image.svelte";
  import Title from "$lib/elements/Title.svelte";
  import Card from "$lib/parts/Card.svelte";
  import Section from "$lib/parts/Section.svelte";

  let bgLoaded = false;
</script>

<header class="relative flex min-h-[50svh] flex-wrap items-center gap-16">
  <!-- <img src={sammy} width="128" height="128" alt="" class="h-72 w-auto" /> -->

  <div class="mx-auto mt-32 w-full max-w-screen-xl text-6xl font-bold uppercase text-zinc-200 drop-shadow">
    Community of
    <div class="-ml-0.5 text-8xl text-red">
      RED<span class="text-zinc-400">engine</span> modding
    </div>
    enthusiasts
  </div>

  <div class="absolute right-0 -z-10 w-2/3 opacity-75 mix-blend-lighten">
    <div class="isolate bg-red transition" class:opacity-0={!bgLoaded}>
      <video
        use:mediaReady={() => (bgLoaded = true)}
        class="h-auto w-full mix-blend-multiply transition-all hover:mix-blend-luminosity"
        autoplay
        loop
        muted
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
    <!-- <span class="masked-shadow absolute bottom-0 h-1/2 w-[90%]" /> -->
  </div>
</header>

<p class="mx-auto my-16 max-w-3xl text-center text-2xl">
  We are a community formed around modding <strong>The Witcher 3</strong>, the release of
  <strong>Cyberpunk 2077</strong> expanded our community dramatically. <Button inline href="/about">Read more...</Button
  >
</p>
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

<Section>
  <Card horizontal title="Check out our wiki!" href="https://wiki.redmodding.org">
    <span slot="logo" class="p-4 px-6 text-7xl font-bold text-red">wiki</span>

    Our wiki is a community-driven collection of guides for modding and documentation about our tools.
  </Card>
</Section>

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
