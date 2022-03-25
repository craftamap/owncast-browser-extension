<template>
  <CrossCircle class="icon error-icon" />
</template>

<script>
import { XCircleIcon } from '@heroicons/vue/solid'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ErrorIcon',
	components: {
		CrossCircle: XCircleIcon,
	},
})
</script>

<style lang="scss">
@import "../../../scss/colors.scss";

.error-icon {
  color: $red-600;
}
</style>
