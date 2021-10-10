import lzString from 'lz-string';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export type State = 'preparing' | 'presenting';
export type Context = {
  presenters: Array<{ name: string; skip?: boolean }>;
  giphy?:
    | {
        type: 'preselected';
        gifUrls: string[];
      }
    | {
        type: 'random';
        searchTerm: string;
      };
};
export type WritableContext = Writable<Context>;
type PersistableContext = {
  presenters: string[];
  giphy?: Context['giphy'];
};

export function createContext(): WritableContext {
  const context: Context = getContextFromParams() ?? getDefaultContext();

  return writable(context);
}

export function persistContext(context: Context) {
  const persistableContext = toPersistableContext(context);
  const serialized = serializeContext(persistableContext);

  if (!serialized) {
    console.warn('Failed to serialize context', context);
    return;
  }

  window.history.pushState(null, '', `#?context=${serialized}`);
}

export function getDefaultGiphyContext(): Required<Context>['giphy'] {
  return {
    type: 'preselected',
    gifUrls: [
      'https://media.giphy.com/media/QPQ3xlJhqR1BXl89RG/giphy.gif',
      'https://media.giphy.com/media/lP4jmO461gq9uLzzYc/giphy.gif',
      'https://media.giphy.com/media/3ohuPDuPHDuGnVtp5u/giphy.gif',
      'https://media.giphy.com/media/GiWEowj3nQv9C/giphy.gif',
      'https://media.giphy.com/media/tXL4FHPSnVJ0A/giphy.gif',
      'https://media.giphy.com/media/FoH28ucxZFJZu/giphy.gif',
      'https://media.giphy.com/media/3o7TKxOhkp8gO0LXMI/giphy.gif',
      'https://media.giphy.com/media/ZbZaqMgYi4HXOWboq6/giphy.gif',
      'https://media.giphy.com/media/lrVFbqkD1IsW8xKzDz/giphy.gif',
      'https://media.giphy.com/media/5niFv9V4ZzJX2X9Qn0/giphy.gif',
      'https://media.giphy.com/media/rq6c5xD7leHW8/giphy.gif',
      'https://media.giphy.com/media/LTYT5GTIiAMBa/giphy.gif',
    ],
  };
}

function getContextFromParams(): Context | undefined {
  const hashString = window.location.hash.substr(1);
  const params = new URLSearchParams(hashString);
  const contextParam = params.get('context');

  if (!contextParam) return;

  const persistedContext = deserializeContext(contextParam);

  if (persistedContext) {
    return toContext(persistedContext);
  }
}

function deserializeContext(value: string): PersistableContext | undefined {
  try {
    const deserialized = lzString.decompressFromEncodedURIComponent(value);
    if (deserialized === '{}') return;
    return JSON.parse(deserialized);
  } catch (err) {
    return;
  }
}

function serializeContext(context: PersistableContext): string | undefined {
  try {
    const jsonString = JSON.stringify(context);
    return lzString.compressToEncodedURIComponent(jsonString);
  } catch (err) {
    // TODO
  }
}

function toContext(persistableContext: PersistableContext): Context {
  return {
    ...persistableContext,
    presenters: persistableContext.presenters.map((presenter) => ({
      name: presenter,
    })),
  };
}

function toPersistableContext(context: Context): PersistableContext {
  return {
    ...context,
    presenters: context.presenters.map((presenter) => presenter.name),
  };
}

function getDefaultContext(): Context {
  return {
    presenters: [],
  };
}
