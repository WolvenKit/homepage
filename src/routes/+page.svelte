<script lang="ts">
  import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord";
  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
  import { faPatreon } from "@fortawesome/free-brands-svg-icons/faPatreon";
  import cet from "$assets/cet.png";
  import sammy from "$assets/sammy.png";
  import wkit from "$assets/wkit.png";
  import Button from "$lib/parts/Button.svelte";
  import Card from "$lib/parts/Card.svelte";
  import Image from "$lib/parts/Image.svelte";
</script>

<header class="relative mx-auto flex flex-wrap justify-center gap-8 pt-16">
  <img src={sammy} width="256" height="256" alt="" />
  <div class="flex flex-col items-center justify-center pt-8">
    <h1 class="text-6xl font-bold uppercase leading-none text-red md:text-7xl lg:text-8xl">Red Modding</h1>

    <p class="inline-block text-2xl font-bold uppercase leading-none text-cyan-light">
      Deep dive into the modder space
    </p>
  </div>
</header>

<nav class="mt-8">
  <div class="text-md text-center text-zinc-400">Get in touch:</div>
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

<main class="flex w-full flex-col items-center p-2">
  <p class="my-16 max-w-3xl text-center">
    We are a diverse community of enthusiasts which formed around a shared passion for modding
    <strong>REDengine</strong>
    with
    <strong>The Witcher 3</strong>. The release of <strong>Cyberpunk 2077</strong> expanded our community dramatically. Modding
    Cyberpunk 2077 has been made possible in large part due to significant efforts from developers active within our community.
  </p>

  <Card horizontal title="Check out our wiki!" href="https://wiki.redmodding.org">
    <span slot="logo" class="cyber-text p-4 px-6 text-7xl">Wiki</span>

    Our wiki is a community-driven collection of guides for modding Cyberpunk 2077 and documentation about our tools.
  </Card>

  <h2 class="mb-8 mt-16 text-4xl uppercase text-zinc-300">Tools</h2>

  <nav class="flex flex-wrap justify-center gap-4">
    <Card title="WolvenKit" href="https://github.com/WolvenKit/WolvenKit/releases/latest">
      <Image slot="logo" src={wkit} />

      Community Mod editor/creator for REDengine games.
    </Card>

    <Card title="Cyber Engine Tweaks" href="https://github.com/maximegmd/CyberEngineTweaks/releases/latest">
      <Image slot="logo" src={cet} />
      Cyberpunk 2077 tweaks, hacks and scripting framework.
    </Card>

    <Card title="SoundDB" href="https://sounddb.redmodding.org">
      Database of all sounds and voice-overs in Cyberpunk 2077.
    </Card>

    <Card title="Blender Plugin" href="">TODO</Card>
  </nav>
</main>

<footer class="mt-8 flex w-full flex-wrap items-start justify-center p-8">
  <a href="https://wiki.redmodding.org/" class="cyber-text text-3xl">Link Harder </a>
</footer>
