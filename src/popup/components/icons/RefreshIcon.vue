<template>
  <Refresh
    :class="{'animate-spin':isLoading }"
  />
</template>

<script>
import { RefreshIcon } from '@heroicons/vue/solid'

export default {
	name: 'RefreshIcon',
	components: {
		Refresh: RefreshIcon,
	},
	props: { isLoading: Boolean },
}
</script>

<style lang="scss">

.animate-spin {
	animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
