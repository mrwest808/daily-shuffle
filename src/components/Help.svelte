<script lang="ts">
  import { fly } from 'svelte/transition';

  enum MenuItem {
    keyboard = 'keyboard',
  }

  let isOpen = false;

  function toggleOpen() {
    isOpen = !isOpen;
  }

  const handleMenuItemClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    const { currentTarget } = event;

    switch (currentTarget.dataset.target as MenuItem) {
      case MenuItem.keyboard:
        console.log('keyboard shortcuts');
        return '';
      default:
      // ignore
    }
  };
</script>

<div class="fixed right-4 bottom-4">
  <button
    class="bg-white shadow border border-black border-opacity-20 rounded-full w-8 h-8"
    on:click={toggleOpen}>?</button
  >

  {#if isOpen}
    <div
      in:fly={{ y: 12, duration: 300 }}
      out:fly={{ y: 6, duration: 180 }}
      class="origin-top-right mb-2 absolute right-0 bottom-full mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
    >
      <div class="py-1" role="none">
        <button
          class="text-black bg-black bg-opacity-0 text-opacity-75 block w-full text-left px-4 py-2 text-sm hover:bg-opacity-5"
          data-target={MenuItem.keyboard}
          on:click={handleMenuItemClick}
          role="menuitem"
        >
          Keyboard shortcuts
        </button>
      </div>
    </div>
  {/if}
</div>
