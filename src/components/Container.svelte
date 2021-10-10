<script lang="ts">
  import { clsx } from '$lib/clsx';

  $: className = clsx('w-full max-w-xl mx-auto', $$props.class);
</script>

<div class={className}>
  <slot />
</div>
