<script lang="ts">
  import { fade } from 'svelte/transition';
  import podium from '$assets/podium.png';
  import { fetchRandomUrl } from '$lib/giphy';
  import Container from './Container.svelte';
  import VerticallyCentered from './VerticallyCentered.svelte';

  let searchTerm = 'singing';
  let wayTooLong = false;
  let giphyUrl = '';

  $: fetchGiphyUrl(wayTooLong);

  async function fetchGiphyUrl(active: boolean) {
    if (!active) {
      giphyUrl = '';
    }

    giphyUrl = await fetchRandomUrl(searchTerm);
  }

  function handleKeyDown(event: KeyboardEvent) {
    const { key } = event;

    if (key === 't') {
      wayTooLong = !wayTooLong;
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<VerticallyCentered>
  <Container class="space-y-8">
    <div
      data-stage
      class="relative overflow-hidden bg-white rounded-lg shadow-lg px-12 pt-12 space-y-6 flex flex-col items-center"
    >
      <h5 class="text-white text-6xl font-bold">Johan</h5>
      <img class="z-10 w-full max-w-md" src={podium} alt="podium" />
      {#if wayTooLong && giphyUrl}
        <img
          in:fade={{ duration: 8000 }}
          class="w-full absolute bottom-0 left-0 h-full object-cover opacity-75 pointer-events-none"
          src={giphyUrl}
          alt="a GIF indicating that the speaker is taking too long"
        />
      {/if}
    </div>
    <div class="text-center">
      <button
        class="text-xl text-gray-700 transition-transform hover:transform hover:scale-105"
      >
        Next up: <span class="font-medium text-black">Anders</span></button
      >
    </div>
  </Container>
</VerticallyCentered>

<style>
  [data-stage] {
    background-image: url(/stage.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
