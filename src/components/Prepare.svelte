<script lang="ts">
  import type { WritableContext } from '$lib/state';
  import Button from './Button.svelte';
  import Container from './Container.svelte';
  import VerticallyCentered from './VerticallyCentered.svelte';

  export let context: WritableContext;
  export let onStart: () => void;

  let presenterName: string = '';

  $: presenterCount = $context.presenters.length;
  $: skippedPresenterCount = $context.presenters.filter(
    (presenter) => presenter.skip,
  ).length;

  const handlePresenterSubmit: svelte.JSX.FormEventHandler<HTMLFormElement> = (
    event,
  ) => {
    event.preventDefault();
    if (!presenterName) return;
    $context.presenters = [{ name: presenterName }, ...$context.presenters];
    presenterName = '';
  };

  function skipPresenter(byIndex: number) {
    $context.presenters = $context.presenters.map((presenter, index) => {
      if (index === byIndex) {
        return {
          ...presenter,
          skip: !presenter.skip,
        };
      }

      return presenter;
    });
  }

  function removePresenter(byIndex: number) {
    $context.presenters = $context.presenters.filter(
      (_, index) => index !== byIndex,
    );
  }

  function sortPresenters() {
    $context.presenters = $context.presenters.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });
  }
</script>

<VerticallyCentered>
  <Container class="space-y-16 my-12">
    <section class="space-y-6">
      <h2 class="text-4xl font-bold text-center">Presenters</h2>
      <form on:submit={handlePresenterSubmit}>
        <label for="presenter" class="sr-only">Name of presenter</label>
        <input
          type="text"
          name="presenter"
          id="presenter"
          class="h-16 px-4 block w-full text-xl shadow-sm border border-black border-opacity-10 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter name..."
          bind:value={presenterName}
        />
        <button class="hidden" type="submit">Submit</button>
      </form>
      {#if !$context.presenters.length}
        <p class="text-center max-w-prose text-black text-opacity-60">
          Get started by adding a presenter in the input field above.
        </p>
      {:else}
        <div class="space-y-3">
          <div class="flex justify-between">
            <p class="text-black text-opacity-75">
              Number of presenters: {presenterCount - skippedPresenterCount}
              {#if skippedPresenterCount > 0}
                <span class="text-black text-opacity-40">
                  ({skippedPresenterCount} skipped)
                </span>
              {/if}
            </p>
            <Button on:click={sortPresenters}>Sort (A-Z)</Button>
          </div>
          <ul
            role="list"
            class="divide-y divide-black divide-opacity-20 bg-white rounded-md shadow-sm border border-black border-opacity-10"
          >
            {#each $context.presenters as presenter, index}
              <li class="p-4 flex justify-between">
                <span class="font-bold" class:skipped={presenter.skip}
                  >{presenter.name}</span
                >
                <div class="flex space-x-2">
                  <Button on:click={() => skipPresenter(index)}
                    >{presenter.skip ? 'Unskip' : 'Skip'}</Button
                  >
                  <Button
                    variant="danger"
                    on:click={() => removePresenter(index)}>Remove</Button
                  >
                </div>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </section>
    <section class="space-y-3">
      <h2 class="text-4xl font-bold text-center">GIFs</h2>
      <p class="text-center text-black text-opacity-60">Coming soon...</p>
    </section>
    <div class="text-center">
      <Button
        class="relative text-2xl px-9 py-3"
        disabled={presenterCount - skippedPresenterCount <= 1}
        variant="primary"
        on:click={onStart}
      >
        Start
      </Button>
    </div>
  </Container>
</VerticallyCentered>

<style lang="postcss">
  .skipped {
    @apply line-through text-black text-opacity-50;
  }
</style>
