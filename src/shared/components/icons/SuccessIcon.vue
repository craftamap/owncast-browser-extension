<template>
  <CheckCircleIcon class="success-icon" />
</template>

<script>

import { CheckCircleIcon } from '@heroicons/vue/solid'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'SuccessIcon',
	components: {
		CheckCircleIcon,
	},
})
</script>

<style lang="scss">
@import "../../../scss/colors.scss";

.success-icon {
  color: $green-500;
}
</style>
