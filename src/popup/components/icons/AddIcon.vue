<template>
  <svg
    id="add-button"
    class="add-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    @click="emitClick"
  >
    <path
      fill-rule="evenodd"
      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
      clip-rule="evenodd"
    />
  </svg>
</template>

<script>
export default {
	name: 'AddIcon',
	methods: {
		emitClick() {
			this.$emit('click');
		}  
	}
}
</script>

<style lang="scss">
.add-icon {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.add-icon-big {
  width: 1.5rem;
  height: 1.5rem;
}
</style>

