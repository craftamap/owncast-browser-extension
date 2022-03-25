<template>
  <Chevron
    class="icon chevron-icon"
    :class="`chevron-icon-${orientation}`"
  />
</template>

<script>
import { ChevronDownIcon } from '@heroicons/vue/solid'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ChevronIcon',
	components: {
		Chevron: ChevronDownIcon,
	},
	props: {
		orientation: {
			type: String,
			default: 'down',
		},
	},
})
</script>

<style lang="scss">
.chevron-icon {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.chevron-icon-up {
		transform: rotate(180deg);
}

</style>
