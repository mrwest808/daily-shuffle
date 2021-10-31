<script lang="ts">
  import mitt, { Emitter } from 'mitt';
  import { onDestroy, setContext } from 'svelte';
  import {
    contextKey,
    keyboardShortcutsEnabled,
    KeyboardShortcut,
    KeyboardShortcutContext,
    KeyboardShortcutHandler,
    KeyboardShortcutMap,
  } from '$lib/keyboard';

  let emitter: Emitter<typeof KeyboardShortcutMap> = mitt();
  let handlers: Array<{
    shortcut: KeyboardShortcut | '*';
    handler: KeyboardShortcutHandler;
  }> = [];

  const onShortcut: KeyboardShortcutContext['onShortcut'] = (
    shortcut,
    handler,
  ) => {
    handlers = [...handlers, { shortcut, handler }];

    // TypeScript buffoonery.. (งツ)ว
    if (shortcut === '*') {
      emitter.on('*', handler);
    } else {
      emitter.on(shortcut, handler);
    }
  };

  setContext<KeyboardShortcutContext>(contextKey, { onShortcut });

  onDestroy(() => {
    handlers.forEach(({ shortcut, handler }) => {
      if (shortcut === '*') {
        emitter.off('*', handler);
      } else {
        emitter.off(shortcut, handler);
      }
    });
  });

  function handleKeyDown(event: KeyboardEvent) {
    if (!$keyboardShortcutsEnabled || !handlers.length) {
      return;
    }

    if (KeyboardShortcutMap[event.key as KeyboardShortcut]) {
      emitter.emit(
        event.key as KeyboardShortcut,
        event.key as KeyboardShortcut,
      );
      event.stopPropagation();
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<slot />
