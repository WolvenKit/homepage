<div class="mx-auto my-16 max-w-[80rem] px-4">
  <div class="revert-tailwind font white">
    <slot></slot>
  </div>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

  .revert-tailwind {
    all: initial;
  }

  .revert-tailwind > :global(*) {
    all: revert;
  }

  .white {
    color: #ffffff;
  }

  .font {
    font-family: Roboto, Times, serif;
  }
</style>
