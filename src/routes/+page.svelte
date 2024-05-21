<script lang="ts">
  import sammy from "$assets/sammy.png";
  import Cyberspace from "$lib/parts/Cyberspace.svelte";

  let elements: HTMLElement[];
</script>

<header class="relative mx-auto mb-8 flex flex-wrap justify-center gap-8 pt-16">
  <Cyberspace bind:elements></Cyberspace>
  <img bind:this={elements[0]} src={sammy} width="256" height="256" alt="" />
  <div class="flex flex-col items-center pt-8">
    <h1
      bind:this={elements[1]}
      data-cybertext
      class="mt-auto text-6xl font-bold uppercase leading-none text-red md:text-7xl lg:text-8xl"
    >
      Red Modding
    </h1>

    <p
      bind:this={elements[2]}
      data-cybertext
      class="mb-auto inline-block text-2xl font-bold uppercase italic leading-none text-cyan-light"
    >
      Deep dive into the modder space
    </p>

    <ul class="mt-8">
      <li><a>a</a></li>
    </ul>
  </div>
</header>

<main class="mx-auto flex max-w-screen-xl flex-col items-center p-2">
  <p class="max-w-3xl text-center">
    We are a diverse community of enthusiasts which formed around a shared passion for modding
    <strong>REDengine</strong>
    with
    <strong>The Witcher 3</strong>. The release of <strong>Cyberpunk 2077</strong> expanded our community dramatically. Modding
    Cyberpunk 2077 has been made possible in large part due to significant efforts from developers active within our community.
  </p>
</main>
