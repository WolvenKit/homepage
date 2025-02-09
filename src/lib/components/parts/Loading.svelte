<script lang="ts">
  import DotsBackground from "./DotsBackground.svelte";
</script>

<div class="relative flex items-center justify-center p-16">
  <DotsBackground maskPos={[50, 50]} class="-inset-32 bg-transparent">
    <div class="ping text-red absolute inset-0 rounded-full"></div>
  </DotsBackground>

  <span class="text-red text-4xl font-bold uppercase">Loading...</span>
</div>

<style>
  .ping {
    background-image: radial-gradient(closest-side at center, transparent, currentColor 80%, transparent);
    animation: ping 1s infinite linear;
  }

  @keyframes ping {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1.5);
      opacity: 0;
    }
  }
</style>
