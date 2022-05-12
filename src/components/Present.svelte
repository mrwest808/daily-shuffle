<script lang="ts">
  import { fade } from 'svelte/transition';
  import podium from '$assets/podium.png';
  import { fetchRandomUrl } from '$lib/giphy';
  import { getKeyboardShortcutContext } from '$lib/keyboard';
  import { Context, getDefaultGiphyContext } from '$lib/state';
  import { getRandomElement } from '$lib/utils';
  import Container from './Container.svelte';
  import KeyboardShortcuts from './KeyboardShortcuts.svelte';
  import StragglerForm from './StragglerForm.svelte';
  import VerticallyCentered from './VerticallyCentered.svelte';

  export let giphy: Required<Context>['giphy'] = getDefaultGiphyContext();
  export let presenters: Context['presenters'];

  let wrapItUp = false;
  let giphyUrl = '';
  let lastUsedGifUrls: string[] = [];
  let currentPresenterIndex = 0;
  let stragglers: typeof presenters = [];

  $: allPresenters = [...presenters, ...stragglers];
  $: presentersLeft = allPresenters.length - currentPresenterIndex - 1;
  $: currentPresenter = allPresenters[currentPresenterIndex];
  $: nextPresenter = allPresenters[currentPresenterIndex + 1];
  $: fetchGiphyUrl(wrapItUp);

  const { onShortcut } = getKeyboardShortcutContext();

  onShortcut('*', (shortcut) => {
    switch (shortcut) {
      case 't':
        wrapItUp = !wrapItUp;
        break;
      case 'n':
      case 'ArrowRight':
        goToNextPresenter();
        break;
      case 'p':
      case 'ArrowLeft':
        goToPreviousPresenter();
        break;
    }
  });

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

  function goToPreviousPresenter() {
    if (currentPresenterIndex > 0) {
      currentPresenterIndex = currentPresenterIndex - 1;
      resetGetOnWithIt();
    }
  }

  function goToNextPresenter() {
    if (currentPresenterIndex < allPresenters.length - 1) {
      currentPresenterIndex = currentPresenterIndex + 1;
      resetGetOnWithIt();
    }
  }

  function resetGetOnWithIt() {
    if (wrapItUp) {
      wrapItUp = false;
    }
  }

  function addStraggler(straggler: { name: string }) {
    stragglers = [...stragglers, straggler];
  }
</script>

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
          alt="a GIF indicating that the presenter is taking too long"
        />
      {/if}
      {#if presentersLeft > 0}
        <div class="absolute bottom-2 right-3">
          <span class="text-xs text-white text-opacity-40 ml-1.5"
            >{presentersLeft}
            {presentersLeft > 1 ? 'presenters' : 'presenter'} left</span
          >
        </div>
      {/if}
    </div>
    <div class="text-center">
      {#if nextPresenter}
        <button
          class="text-xl text-black text-opacity-70 transition-transform hover:transform hover:scale-105"
          on:click={goToNextPresenter}
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

<StragglerForm onAddStraggler={addStraggler} />
<KeyboardShortcuts />

<style>
  [data-stage] {
    background-color: black;
    background-image: url(/stage.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
