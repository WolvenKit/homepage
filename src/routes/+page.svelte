<script lang="ts">
  import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord";
  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
  import { faPatreon } from "@fortawesome/free-brands-svg-icons/faPatreon";
  import cet from "$assets/cet.png";
  import wkit from "$assets/wkit.png";
  import Button from "$lib/parts/Button.svelte";
  import Card from "$lib/parts/Card.svelte";
  import Image from "$lib/parts/Image.svelte";
</script>

<div class="my-16 flex w-full flex-col items-center gap-16 p-2">
  <p class="max-w-3xl text-center">
    We are a diverse community of enthusiasts which formed around a shared passion for modding
    <strong>REDengine</strong>
    with
    <strong>The Witcher 3</strong>. The release of <strong>Cyberpunk 2077</strong> expanded our community dramatically. Modding
    Cyberpunk 2077 has been made possible in large part due to significant efforts from developers active within our community.
  </p>

  <nav>
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

  <Card horizontal title="Check out our wiki!" href="https://wiki.redmodding.org">
    <span slot="logo" class="p-4 px-6 text-7xl font-bold text-red">wiki</span>

    Our wiki is a community-driven collection of guides for modding and documentation about our tools.
  </Card>

  <h2 class="-mb-8 text-4xl uppercase text-zinc-300">Our Main Projects</h2>

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
</div>

<footer class="mt-8 flex w-full flex-wrap items-start justify-center p-8">
  <a href="https://wiki.redmodding.org/" class="cyber-text text-3xl">Link Harder </a>
</footer>
