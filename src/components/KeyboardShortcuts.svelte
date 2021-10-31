<script lang="ts">
  import { getKeyboardShortcutContext } from '$lib/keyboard';

  import { expoOut } from 'svelte/easing';
  import { fade, fly } from 'svelte/transition';
  import KBD from './KBD.svelte';

  let isOpen = false;

  const { onShortcut } = getKeyboardShortcutContext();

  onShortcut('*', (shortcut) => {
    switch (shortcut) {
      case 'h':
        toggleOpen();
        break;
      default:
        if (isOpen) {
          toggleOpen();
        }
    }
  });

  function toggleOpen() {
    isOpen = !isOpen;
  }
</script>

<button
  class="fixed bottom-4 right-4 text-black text-opacity-60 hover:text-opacity-100 focus:text-opacity-100"
  on:click={toggleOpen}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    fill="currentColor"
    ><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" /><path
      d="M20 7v10H4V7h16m0-2H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2zm0 3h2v2h-2zM8 8h2v2H8zm0 3h2v2H8zm-3 0h2v2H5zm0-3h2v2H5zm3 6h8v2H8zm6-3h2v2h-2zm0-3h2v2h-2zm3 3h2v2h-2zm0-3h2v2h-2z"
    /></svg
  >
</button>

{#if isOpen}
  <div
    class="fixed z-30 isolate inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        in:fade={{ duration: 300, easing: expoOut }}
        out:fade={{ duration: 125 }}
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        on:click={toggleOpen}
      />

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true">&#8203;</span
      >

      <div
        in:fly={{ duration: 300, y: 16, easing: expoOut }}
        out:fly={{ duration: 125, y: 8 }}
        class="inline-block align-bottom bg-white rounded-lg p-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6"
      >
        <div class="space-y-2">
          <h5 class="font-medium text-black text-opacity-60">
            Keyboard shortcuts
          </h5>
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-2 flex items-center space-x-4">
              <dt class="flex items-center"><KBD>N</KBD></dt>
              <dd>Next presenter</dd>
            </div>
            <div class="py-2 flex items-center space-x-4">
              <dt class="flex items-center"><KBD>P</KBD></dt>
              <dd>Previous presenter</dd>
            </div>
            <div class="py-2 flex items-center space-x-4">
              <dt class="flex items-center"><KBD>T</KBD></dt>
              <dd>Remind presenter to wrap it up</dd>
            </div>
            <div class="py-2 flex items-center space-x-4">
              <dt class="flex items-center"><KBD>H</KBD></dt>
              <dd>Show this help modal</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
{/if}
