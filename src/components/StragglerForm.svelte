<script lang="ts">
  import {
    getKeyboardShortcutContext,
    keyboardShortcutsEnabled,
  } from '$lib/keyboard';

  export let onAddStraggler: (straggler: { name: string }) => void;

  let container: HTMLDivElement;
  let editing = false;
  let name = '';

  $: {
    if (editing) {
      startEditing();
    } else {
      stopEditing();
    }
  }

  const { onShortcut } = getKeyboardShortcutContext();

  onShortcut('*', (shortcut) => {
    if (!editing && shortcut === 'a') {
      toggleEditing();
    }
  });

  const toggleEditing = () => {
    editing = !editing;
  };

  const startEditing = () => {
    $keyboardShortcutsEnabled = false;
    setTimeout(() => {
      container.querySelector('input')?.focus();
    }, 0);
  };

  const stopEditing = () => {
    $keyboardShortcutsEnabled = true;
    name = '';
  };

  const handleKeyDown: svelte.JSX.KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (event.key === 'Escape') {
      toggleEditing();
    }
  };

  interface StragglerFormElements extends HTMLFormControlsCollection {
    straggler: HTMLInputElement;
  }

  interface StragglerForm extends HTMLFormElement {
    readonly elements: StragglerFormElements;
  }

  const handleSubmit: svelte.JSX.FormEventHandler<HTMLFormElement> = (
    event,
  ) => {
    event.preventDefault();
    const form = event.currentTarget as StragglerForm;
    const input = form.elements['straggler'];

    if (input.value.length > 0) {
      onAddStraggler({ name: input.value });
    }

    toggleEditing();
  };
</script>

<div bind:this={container} class="fixed bottom-4 left-4 flex">
  {#if !editing}
    <button
      class="text-black text-opacity-60 hover:text-opacity-100 focus:text-opacity-100"
      on:click={toggleEditing}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle
          cx="8.5"
          cy="7"
          r="4"
        /><line x1="20" y1="8" x2="20" y2="14" /><line
          x1="23"
          y1="11"
          x2="17"
          y2="11"
        /></svg
      >
    </button>
  {:else}
    <form on:submit={handleSubmit}>
      <input
        bind:value={name}
        class="bg-transparent border-0 p-0"
        name="straggler"
        on:keydown={handleKeyDown}
        type="text"
      />
    </form>
  {/if}
</div>

<style>
  input:focus {
    box-shadow: none !important;
    outline: none !important;
  }
</style>
