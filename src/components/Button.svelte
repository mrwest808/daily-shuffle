<script lang="ts">
  import { clsx } from '$lib/clsx';

  export let disabled: boolean | undefined = undefined;
  export let variant: 'primary' | 'danger' | undefined = undefined;

  $: className = clsx(
    'inline-flex items-center px-2.5 py-0.5 rounded text-xs border border-black font-medium',
    !disabled && 'active:transform active:translate-y-px',
    disabled && 'opacity-40 cursor-not-allowed',
    !variant && 'bg-white',
    variant === 'danger' && 'border-red-600 bg-red-600 text-white',
    variant === 'primary' && 'bg-black text-white',
    $$props.class,
  );
</script>

<button class={className} {disabled} on:click>
  <slot />
</button>
