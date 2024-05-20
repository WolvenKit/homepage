<script lang="ts">
  import sammy from "$assets/sammy.png";
  import HoloRays from "$lib/parts/HoloRays.svelte";
  import Panel from "$lib/parts/Panel.svelte";

  let elements: HTMLElement[];
</script>

<!-- <Cyberspace> -->
<HoloRays bind:elements>
  <header class="mx-auto mb-4 mt-16 flex flex-wrap items-center justify-center gap-8">
    <img bind:this={elements[0]} src={sammy} width="256" height="256" alt="" />
    <div class="text-center">
      <h1 bind:this={elements[1]} class="text-6xl font-bold uppercase leading-none text-red md:text-7xl lg:text-8xl">
        Red Modding
      </h1>
      <p bind:this={elements[2]} class="inline-block text-2xl font-bold uppercase italic leading-none">
        Deep dive into the cyberspace
      </p>
    </div>
  </header>
</HoloRays>

<main class="mx-auto flex max-w-screen-xl flex-col items-center">
  Hewwo, im main content and stuff, im a panel, random text, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
  in metus eget velit tincidunt tincidunt. Sed non leo euismod, tincidunt libero nec, tincidunt nisi. Nulla facilisi.
  Sed euismod, sem eu efficitur tincidunt, quam ipsum tincidunt nisi, ut tincidunt nisi ligula euismod eros. Donec
  euismod, sem eu efficitur tincidunt, quam ipsum tincidunt nisi, ut tincidunt nisi ligula euismod eros.
  <Panel></Panel>
</main>
<!-- </Cyberspace> -->
