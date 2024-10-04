<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Button from "../elements/Button.svelte";
  import ThemeButton from "../theme/ThemeButton.svelte";
  import ErrorAlert from "./ErrorAlert.svelte";

  const DELTA = 1000 / 60;
  const MAX_ITERS = 64;

  const GRAVITY = -0.3;
  const JUMP = 10;
  const SPEED = 3;
  const ACCELERATION = 0.0001;

  const GAME_WIDTH = 1024;
  const GAME_MAX = BigInt(Math.floor(GAME_WIDTH * 0.75));
  const GAME_MIN = BigInt(Math.floor(-GAME_WIDTH * 0.23));
  const PLAYER_SIZE = 30n;
  const MIN_SPIKE_DIST = 16n;
  const MAX_SPIKE_DIST = GAME_MAX;
  const SPIKE_HEIGHT = 16;

  export let sprite: string;

  const emit = createEventDispatcher<{ exit: void }>();

  // "Engine"
  let frame = 0;
  let lastTimestamp = 0;
  let deltaAccumulator = 0;

  // Game
  let spikes = [GAME_MAX];
  let nextSpike = GAME_MAX;
  let canDoubleJump = true;

  let gameSpeed = 1;
  let velocityY = 0;
  let y = 0;
  let x = 0n;
  let targetAngle = 0;

  let tps = 60;

  // Controls
  let shouldJump = false;

  let isDead = false;

  function reset() {
    lastTimestamp = 0;
    deltaAccumulator = 0;

    spikes = [GAME_MAX];
    nextSpike = GAME_MAX;
    canDoubleJump = true;

    gameSpeed = 1;
    velocityY = 0;
    y = 0;
    x = 0n;
    isDead = false;
  }

  function jump() {
    if (!frame) return;

    shouldJump = true;

    targetAngle = targetAngle + 90;
  }

  function onKeyDown(ev: KeyboardEvent) {
    switch (ev.code) {
      case "ArrowUp":
      case "Space":
        jump();
        ev.preventDefault();
        break;
      case "Escape":
        exit();
        break;
    }
  }

  function exit() {
    stop();
    emit("exit");
  }

  function die() {
    isDead = true;
    stop();
  }

  function update(timestamp = 0) {
    frame = window.requestAnimationFrame(update);

    if (!timestamp) return;

    const ready = !!lastTimestamp;

    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (!ready) return;
    deltaAccumulator += delta;

    if (delta) {
      tps = tps * 0.9 + (1000 / delta) * 0.1;
    }

    let i = 0;
    while (deltaAccumulator >= DELTA && i++ < MAX_ITERS) {
      deltaAccumulator -= DELTA;

      // Controls
      if (shouldJump) {
        shouldJump = false;
        if (canDoubleJump) {
          if (y != 0) canDoubleJump = false;
          velocityY += JUMP * gameSpeed;
        }
      }

      // Gravity
      velocityY += GRAVITY * gameSpeed;

      // Jump
      y += velocityY;
      // Move
      x += BigInt(Math.round(SPEED * gameSpeed));

      // Touch ground
      if (y < 0) {
        canDoubleJump = true;
        y = 0;
        velocityY = 0;
      }

      // Spikes
      const nearGround = y < SPIKE_HEIGHT;
      const newSpikes = [];
      const maxX = x + GAME_MAX;
      const minX = x + GAME_MIN;
      let lastSpike = 0n;
      for (const spike of spikes) {
        if (spike < minX) continue;

        newSpikes.push(spike);

        if (nearGround) {
          // Is in the spike's square
          if (Math.abs(Number(x - spike)) < MIN_SPIKE_DIST + PLAYER_SIZE) {
            die();
          }
        }

        lastSpike = spike;
      }

      if (nextSpike < maxX) {
        if (nextSpike > lastSpike) newSpikes.push(nextSpike);

        nextSpike += MIN_SPIKE_DIST + BigInt(Math.trunc(Math.random() * Number(MAX_SPIKE_DIST)));
      }

      spikes = newSpikes;
      gameSpeed += gameSpeed * ACCELERATION;
    }
  }

  function start() {
    reset();
    update();
  }

  function stop() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  }

  onMount(() => {
    start();

    return stop;
  });
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="absolute -inset-4 bg-black blur-lg" />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="absolute inset-0 select-none" on:click={jump}>
  <div class="-mt-4 flex items-start justify-between p-1 px-4 font-semibold tabular-nums text-red">
    <div>
      <Button class="-ml-4" on:click={exit}>Quit game</Button>
      <span class="text-sm text-cyan opacity-75">{Math.round(tps)}</span>
    </div>

    <div class="text-center">
      <div class="small-caps text-sm">Score</div>
      <div class="text-2xl">{x}</div>
    </div>

    <div class="text-right">
      <div class="small-caps text-sm">Heat Level</div>
      <div class="text-xl">{gameSpeed.toFixed(2)}</div>
    </div>
  </div>

  <!-- game -->
  <div class="absolute left-1/4 top-3/4 w-3/4">
    <!-- player -->
    <div class="absolute left-0 mt-px" style:transform="translate(-50%, {-100 - y}%)">
      <img
        class="size-16 border border-red transition-transform duration-300 ease-out"
        src={sprite}
        width={64}
        height={64}
        alt=""
        style:transform="rotate({targetAngle}deg)"
      />
    </div>
    <!-- spikes -->
    <div style:transform="translateX({-x}px)" style:will-change="transform">
      {#each spikes as spikeX (spikeX)}
        <span
          class="absolute bottom-0 left-0 inline-block origin-bottom-right border-[16px] border-transparent border-b-red"
          style:transform="translateX(-50%) translateX({spikeX}px)"
        />
        <!-- transition:scale={{ duration: 500 }} -->
      {/each}
    </div>
  </div>

  <!-- ground -->
  <span class="absolute top-3/4 w-full border-b-2 border-red" />

  <div class="small-caps absolute top-3/4 w-full p-4 text-center text-sm text-red opacity-50">
    Tap or press space to avoid ICE traps
  </div>

  <!-- death -->
  {#if isDead}
    <div class="absolute inset-0 top-8 flex items-center justify-center bg-black/75">
      <div class="flex flex-col bg-black p-4">
        <ErrorAlert title="GAME OVER">
          The ICE traps got you.<br />
        </ErrorAlert>

        <ThemeButton theme="cyberpunk" size="sm" class="ml-auto" on:click={start}>Try again?</ThemeButton>
      </div>
    </div>
  {/if}
</div>
