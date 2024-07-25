<script lang="ts" context="module">
  import type { Team } from "$lib/parts/TeamBadge.svelte";

  export interface Member {
    name: string;
    bio: string;
    image: string;
    teams: Team[];
    theme?: Theme;
  }
</script>

<script lang="ts">
  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
  import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
  import { twMerge } from "tailwind-merge";
  import Button from "$lib/elements/Button.svelte";
  import Image from "$lib/elements/Image.svelte";
  import TeamBadge from "$lib/parts/TeamBadge.svelte";
  import type { Theme } from "$lib/themes";

  export let member: Member;

  $: nameClass =
    {
      Cyberpunk: "cyber-text",
      Witcher: "text-witcher font-[Metamorphous] uppercase",
    }[member.theme as Theme] || "";

  $: descClass =
    {
      Cyberpunk: "text-red",
      Witcher: "",
    }[member.theme as Theme] || "";

  $: borderClass =
    {
      Cyberpunk: "cyberborder border-2 border-red overflow-hidden",
      Witcher: "border-2 border-zinc-300 p-1",
    }[member.theme as Theme] || "";
</script>

<li class="flex items-start">
  <div class="relative flex-shrink-0">
    <Image src={member.image} width={96} height={96} class="size-24 object-cover" />
    {#if member.theme}
      <div class="absolute inset-0 {borderClass}">
        {#if member.theme == "Witcher"}
          <div class="witcher-inner-border h-full w-full border-y-2 border-current text-zinc-300 after:rotate-180" />
        {/if}
      </div>
    {/if}
  </div>

  <div class="flex flex-grow flex-col px-4">
    <h3 class="mb-1 flex flex-wrap items-center gap-x-2">
      <span class={twMerge("text-2xl leading-none", nameClass)}>{member.name}</span>

      {#if member.teams.length}
        <ul class="flex flex-wrap gap-px">
          {#each member.teams as team (team)}
            <li><TeamBadge {team} /></li>
          {/each}
        </ul>
      {/if}
    </h3>

    <p class={twMerge("leading-tight text-zinc-300", descClass)}>{member.bio}</p>

    <ul class="ml-auto mt-auto flex gap-1">
      <li>
        <Button iconOnly hideExternal icon={faGithub} label="GitHub" />
      </li>
      <li>
        <Button iconOnly hideExternal icon={faEnvelope} label="Email" />
      </li>
    </ul>
  </div>
</li>

<style>
  .cyberborder::before,
  .cyberborder::after {
    content: "";
    position: absolute;
    background: black;
    border: inherit;
  }
  .cyberborder::after {
    width: 1.5rem;
    height: 1.5rem;
    right: -0.75rem;
    bottom: -0.75rem;
    transform: rotate(45deg);
  }
  .cyberborder::before {
    top: -0.5rem;
    left: -2px;
    width: 2.5rem;
    height: 1rem;
    transform: skewX(-45deg);
    border-right-width: 3px;
    /* outline: 2px solid red; */
  }

  .witcher-inner-border::before,
  .witcher-inner-border::after {
    content: "";
    display: inline-block;
    height: 100%;
    width: 50%;
    background-color: currentColor;
    clip-path: var(--witcher-border-caret);
  }
</style>
