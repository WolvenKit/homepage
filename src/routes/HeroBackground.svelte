<script lang="ts">
  import malorian from "$assets/malorian-explosion_chart.avif";
  import malorianHEVC from "$assets/malorian-explosion_chart.hevc?url";
  import malorianMP4 from "$assets/malorian-explosion_chart.mp4";
  import malorianAV1 from "$assets/malorian-explosion_chart.webm";
  import { mediaReady } from "$lib/actions/mediaReady";
  import Image from "$components/elements/Image.svelte";

  export let video: HTMLVideoElement;
  let bgLoaded = false;
  let autoplayDisabled = false;

  $: video?.play().catch(() => (autoplayDisabled = true));
</script>

<div
  class="pointer-events-none absolute -top-16 right-0 max-w-[75vw] overflow-hidden bg-red opacity-90 mix-blend-lighten transition max-lg:hidden 2xl:bottom-0"
  class:opacity-0={!bgLoaded}
>
  <div class="crt absolute inset-0" />
  <div class="wave absolute inset-0 text-red" />
  <video
    bind:this={video}
    use:mediaReady={() => (bgLoaded = true)}
    on:play={() => (autoplayDisabled = false)}
    class="h-full w-full bg-black object-contain mix-blend-multiply"
    autoplay
    loop
    muted
    playsinline
    disablepictureinpicture
    disableremoteplayback
    preload=""
    poster={malorian}
  >
    <source media="(min-width: 1024px)" src={malorianHEVC} type="video/hevc; codecs=hevc" />
    <source media="(min-width: 1024px)" src={malorianAV1} type="video/webm; codecs=av1" />
    <source media="(min-width: 1024px)" src={malorianMP4} type="video/mp4; codecs=avc1.640028" />
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
  .crt {
    background-image: radial-gradient(transparent, #000a);
    background-size: 3px 3px;
  }

  .wave {
    --repeats: 2;

    --size: calc(100% / var(--repeats));
    height: 100%;
    background: linear-gradient(to bottom, transparent 10vh, currentColor, transparent 15vh);
    background-size: 100% calc(var(--size) / 2);
    animation: move-wave 5s infinite linear;
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
