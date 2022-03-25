<template>
  <RefreshIcon class="icon loading-icon" />
</template>

<script charset="utf-8">
import { RefreshIcon } from '@heroicons/vue/solid'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'LoadingIcon',
	components: {
		RefreshIcon: RefreshIcon,
	},
})
</script>

<style lang="scss">
.loading-icon {
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
