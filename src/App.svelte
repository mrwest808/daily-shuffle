<script lang="ts">
  import './app.css';
  import { onDestroy } from 'svelte';
  import Layout from '$components/Layout.svelte';
  import { createContext, persistContext, State } from '$lib/state';
  import { shuffleArray } from '$lib/utils';
  import Prepare from '$components/Prepare.svelte';
  import Present from '$components/Present.svelte';
  import KeyboardShortcutListener from './KeyboardShortcutListener.svelte';

  const context = createContext();

  let sawInitialContextValue = false;
  let state: State = 'preparing';

  $: activePresenters = getActivePresenters(state);

  const unsubscribe = context.subscribe(() => {
    if (!sawInitialContextValue) {
      sawInitialContextValue = true;
      return;
    }

    persistContext($context);
  });

  onDestroy(() => {
    unsubscribe();
  });

  function getActivePresenters(state: State) {
    if (state !== 'presenting') {
      return $context.presenters;
    }

    return shuffleArray(
      $context.presenters.filter((presenter) => !presenter.skip),
    );
  }

  function handleStart() {
    state = 'presenting';
  }
</script>

<KeyboardShortcutListener>
  <Layout>
    {#if state === 'preparing'}
      <Prepare onStart={handleStart} {context} />
    {:else}
      <Present giphy={$context.giphy} presenters={activePresenters} />
    {/if}
  </Layout>
</KeyboardShortcutListener>
