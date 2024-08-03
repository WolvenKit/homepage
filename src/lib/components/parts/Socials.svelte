<script lang="ts">
  import type { IconDefinition } from "@fortawesome/fontawesome-common-types";
  import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord";
  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
  import { faPatreon } from "@fortawesome/free-brands-svg-icons/faPatreon";
  import { twMerge } from "tailwind-merge";
  import Button from "$components/elements/Button.svelte";
  import { site } from "$lib/content/site";

  const ICONS: Record<string, IconDefinition> = {
    GitHub: faGithub,
    Discord: faDiscord,
    Patreon: faPatreon,
  };

  let classes = "";
  export { classes as class };
</script>

<address class={twMerge("not-italic", classes)}>
  <h2 class="text-center text-xl uppercase opacity-50">Find us on</h2>
  <ul class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
    {#each Object.entries(site.socials) as [social, link], i (i)}
      <li>
        <Button hideExternal href={link} icon={ICONS[social]}>{social}</Button>
      </li>
    {/each}
  </ul>
</address>
