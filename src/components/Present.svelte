<script lang="ts">
  import { fade } from 'svelte/transition';
  import podium from '$assets/podium.png';
  import { fetchRandomUrl } from '$lib/giphy';
  import { Context, getDefaultGiphyContext } from '$lib/state';
  import { getRandomElement } from '$lib/utils';
  import Container from './Container.svelte';
  import KeyboardShortcuts, {
    KeyboardShortcut,
  } from './KeyboardShortcuts.svelte';
  import VerticallyCentered from './VerticallyCentered.svelte';

  export let giphy: Required<Context>['giphy'] = getDefaultGiphyContext();
  export let presenters: Context['presenters'];

  let wrapItUp = false;
  let giphyUrl = '';
  let lastUsedGifUrls: string[] = [];
  let currentPresenterIndex = 0;

  $: currentPresenter = presenters[currentPresenterIndex];
  $: nextPresenter = presenters[currentPresenterIndex + 1];
  $: fetchGiphyUrl(wrapItUp);

  async function fetchGiphyUrl(active: boolean) {
    if (!active) {
      giphyUrl = '';
      return;
    }

    if (giphy.type === 'random') {
      giphyUrl = await fetchRandomUrl(giphy.searchTerm ?? 'any day now');
    } else {
      let currentUrl = getRandomElement(giphy.gifUrls);
      let iterationCount = 0; // failsafe during development...

      while (lastUsedGifUrls.includes(currentUrl) && iterationCount < 10) {
        currentUrl = getRandomElement(giphy.gifUrls);
        iterationCount++;
      }

      lastUsedGifUrls = [currentUrl, ...lastUsedGifUrls];
      giphyUrl = currentUrl;

      if (lastUsedGifUrls.length > 5) {
        lastUsedGifUrls = lastUsedGifUrls.slice(0, -1);
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    const { key } = event;

    if (key === KeyboardShortcut.wrapItUp) {
      wrapItUp = !wrapItUp;
    }

    if (key === KeyboardShortcut.nextPlayer) {
      nextSpeaker();
    }

    if (key === KeyboardShortcut.prevPlayer) {
      previousSpeaker();
    }
  }

  function previousSpeaker() {
    if (currentPresenterIndex > 0) {
      currentPresenterIndex = currentPresenterIndex - 1;
      resetGetOnWithIt();
    }
  }

  function nextSpeaker() {
    if (currentPresenterIndex < presenters.length - 1) {
      currentPresenterIndex = currentPresenterIndex + 1;
      resetGetOnWithIt();
    }
  }

  function resetGetOnWithIt() {
    if (wrapItUp) {
      wrapItUp = false;
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
      <h5 class="text-white text-6xl font-bold">{currentPresenter.name}</h5>
      <img class="z-10 w-full max-w-md" src={podium} alt="podium" />
      {#if wrapItUp && giphyUrl}
        <img
          in:fade={{ duration: 5000 }}
          class="z-20 w-full absolute bottom-0 left-0 h-full object-cover opacity-75 pointer-events-none"
          src={giphyUrl}
          alt="a GIF indicating that the speaker is taking too long"
        />
      {/if}
    </div>
    <div class="text-center">
      {#if nextPresenter}
        <button
          class="text-xl text-black text-opacity-70 transition-transform hover:transform hover:scale-105"
          on:click={nextSpeaker}
        >
          Next up: <span class="font-medium text-black"
            >{nextPresenter.name}</span
          ></button
        >
      {:else}
        <p class="text-xl text-black text-opacity-50">
          {currentPresenter.name} is the last presenter
        </p>
      {/if}
    </div>
  </Container>
</VerticallyCentered>

<KeyboardShortcuts />

<style>
  [data-stage] {
    background-image: url(/stage.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
