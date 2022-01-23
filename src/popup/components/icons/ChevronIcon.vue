<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="chevron-icon"
    :class="`chevron-icon-${orientation}`"
    viewBox="0 0 20 20"
    fill="currentColor"
    @click="emitClick"
  >
    <path
      fill-rule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clip-rule="evenodd"
    />
  </svg>
</template>

<script>
export default {
	name: 'ChevronIcon',
	props: {
		orientation: {
			type: String,
			default: 'down',
		},
	},
	emits: [
		'click',
	],
	methods: {
		emitClick () {
			this.$emit('click')
		},
	},
}
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
