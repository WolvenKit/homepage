<script lang="ts">
  import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord";
  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
  import { faPatreon } from "@fortawesome/free-brands-svg-icons/faPatreon";
  import car from "$assets/car_placeholder.png";
  import cet from "$assets/cet.png";
  import wkit from "$assets/wkit.png";
  import Button from "$lib/elements/Button.svelte";
  import Image from "$lib/elements/Image.svelte";
  import Title from "$lib/elements/Title.svelte";
  import Card from "$lib/parts/Card.svelte";
  import Section from "$lib/parts/Section.svelte";
</script>

<header class="relative flex min-h-[50svh] flex-wrap items-center gap-16">
  <!-- <img src={sammy} width="128" height="128" alt="" class="h-72 w-auto" /> -->

  <div class="mx-auto w-full max-w-screen-lg text-6xl font-bold uppercase text-zinc-200 drop-shadow">
    Community of
    <div class="-ml-0.5 text-8xl text-red">
      RED<span class="text-zinc-400">engine</span> modding
    </div>
    enthusiasts
  </div>

  <div class="absolute right-0 mt-16 w-1/2 opacity-75">
    <div class="masked bg-red">
      <img src={car} alt="" class="invisible h-auto w-full" />
    </div>
    <span class="masked-shadow absolute -bottom-4 h-1/2 w-[90%] rotate-3" />
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

<style>
  .masked {
    mask: url($assets/car_placeholder.png) luminance 100%/100% no-repeat;
  }
  .masked-shadow {
    --color: color-mix(in srgb, theme("colors.red.DEFAULT") 25%, transparent);
    background: radial-gradient(closest-side, var(--color) 50%, transparent);
  }
</style>
