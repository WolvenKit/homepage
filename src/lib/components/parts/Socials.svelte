<script lang="ts">
  import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord";
  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
  import { faPatreon } from "@fortawesome/free-brands-svg-icons/faPatreon";
  import { twMerge } from "tailwind-merge";
  import Button from "$components/elements/Button.svelte";

  let classes = "";
  export { classes as class };
</script>

<address class={twMerge("not-italic", classes)}>
  <h2 class="text-center text-xl uppercase opacity-50">Find us on</h2>
  <ul class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
    <li>
      <Button hideExternal href="https://github.com/WolvenKit/" icon={faGithub}>GitHub</Button>
    </li>
    <li>
      <Button hideExternal href="https://discord.com/invite/Epkq79kd96" icon={faDiscord}>Discord</Button>
    </li>
    <li>
      <Button hideExternal href="https://www.patreon.com/RedModdingTools" icon={faPatreon}>Patreon</Button>
    </li>
  </ul>
</address>
