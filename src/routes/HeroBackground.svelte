<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import malorian from "$assets/malorian-explosion_chart.avif";
  import Image from "$components/elements/Image.svelte";
  import { mediaReady } from "$lib/actions/mediaReady";

  export let fadeDelay = 0;
  export let video: HTMLVideoElement;
  export let rainbow = true;
  let bgLoaded = false;
  let autoplayDisabled = false;

  const month = new Date().getMonth() + 1;
  const src = [
    {
      webm: "https://files.moonded.com/RedModding/malorian-explosion_chart.webm",
      mp4: "https://files.moonded.com/RedModding/malorian-explosion_chart.mp4",
    },
    {
      webm: "https://static.zhincore.eu/cp/cyberpumpkin.webm",
      mp4: "https://static.zhincore.eu/cp/cyberpumpkin.mp4",
    },
  ][+(month == 10)];

  onMount(() => {
    // Cancel autoplay
    video.pause();
    video.currentTime = 0;

    setTimeout(() => video.play().catch(() => (autoplayDisabled = true)), (fadeDelay + 1) * 1000);
  });
</script>

<div
  class="fade-in pointer-events-none absolute -top-16 right-0 max-w-[75vw] overflow-hidden bg-red opacity-90 mix-blend-lighten transition max-lg:hidden 2xl:bottom-0"
  class:opacity-0={!bgLoaded}
  class:rainbow
  style:--fade-delay="{fadeDelay}s"
>
  <div class="crt absolute inset-0" />
  <div class="wave absolute inset-0 text-red motion-reduce:hidden" />

  <!-- Motion-reduced fallback -->
  <Image src={malorian} class="h-full w-full bg-black object-contain mix-blend-multiply motion-safe:hidden" />

  <video
    bind:this={video}
    use:mediaReady={() => (bgLoaded = true)}
    on:play={() => (autoplayDisabled = false)}
    class="h-full w-full bg-black object-contain mix-blend-multiply motion-reduce:hidden"
    autoplay={!browser}
    loop
    muted
    playsinline
    disablepictureinpicture
    disableremoteplayback
    preload=""
    poster={malorian}
  >
    <!-- <source media="(min-width: 1024px)" src={malorianHEVC} type="video/hevc; codecs=hevc" /> -->
    <source media="(min-width: 1024px)" src={src.webm} type="video/webm; codecs=av1" />
    <source media="(min-width: 1024px)" src={src.mp4} type="video/mp4; codecs=avc1.640028" />
    <Image src={malorian} />
  </video>

  {#if autoplayDisabled}
    <div class="absolute right-0 top-16 p-4 text-lg text-red">Auto-play is disabled. Click to play animation.</div>
  {/if}

  <div class="crt absolute right-0 top-24 max-w-screen-sm bg-red/90 bg-clip-text p-8 text-right text-transparent">
    <div class="text-black/25">
      <h1 class="text-2xl leading-none">Malorian Arms</h1>

      <h2 class="text-3xl font-semibold leading-none">3516</h2>
    </div>
  </div>
</div>

<style>
  .wave {
    --repeats: 2;

    --size: calc(100% / var(--repeats));
    height: 100%;
    background-image: linear-gradient(to bottom, transparent 10vh, currentColor, transparent 15vh);
    background-size: 100% calc(var(--size) / 2);
    animation: move-wave 5s infinite linear;
  }

  .rainbow .wave {
    --repeats: 1;
    background-image: linear-gradient(to bottom in hsl, red, green, blue, red);
  }

  @keyframes move-wave {
    from {
      transform: translateY(calc(var(--size) / 4));
    }
    to {
      transform: translateY(calc(var(--size) / -4));
    }
  }
</style>
