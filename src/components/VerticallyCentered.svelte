<script lang="ts">
  import { clsx } from '$lib/clsx';

  $: className = clsx(
    'min-h-[calc(100vh-2rem)] flex items-center',
    $$props.class,
  );
</script>

<div class={className}>
  <slot />
</div>
