<script lang="ts">
  import { errorStore } from '$lib/store';

  $: message = $errorStore?.message || 'An error occured! Please try again later...';
</script>

<p>{message}</p>
