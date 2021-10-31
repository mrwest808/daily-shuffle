import { getContext } from 'svelte';
import { writable } from 'svelte/store';

export const contextKey = 'keyboard-shortcut';

export type KeyboardShortcut =
  | 'a'
  | 'h'
  | 'n'
  | 'p'
  | 't'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Escape';
export type KeyboardShortcutHandler = (shortcut: KeyboardShortcut) => void;
export type KeyboardShortcutContext = {
  onShortcut(
    shortcut: KeyboardShortcut | '*',
    handler: KeyboardShortcutHandler,
  ): void;
};

export const KeyboardShortcutMap: Record<KeyboardShortcut, KeyboardShortcut> = {
  a: 'a',
  h: 'h',
  n: 'n',
  p: 'p',
  t: 't',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Escape: 'Escape',
};

export function getKeyboardShortcutContext() {
  return getContext<KeyboardShortcutContext>(contextKey);
}

export const keyboardShortcutsEnabled = writable(true);
