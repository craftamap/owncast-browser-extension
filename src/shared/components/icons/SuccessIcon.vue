<template>
  <CheckCircleIcon class="success-icon" />
</template>

<script>

import { CheckCircleIcon } from '@heroicons/vue/solid'

export default {
	name: 'SuccessIcon',
	components: {
		CheckCircleIcon,
	},
}
</script>

<style lang="scss">
@import "../../../scss/colors.scss";

.success-icon {
  color: $green-500;
}
</style>
