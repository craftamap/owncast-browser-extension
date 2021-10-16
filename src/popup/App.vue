<template>
  <!-- theme names must be directly in here, otherwise they get trimmed
       TODO: add themes to not-trim list -->
  <div
    id="theme-wrapper"
    :class="[getTheme === 'dark' ? 'dark' : 'light', getLayout === 'compact' ? 'layout-compact' : 'layout-normal' ]"
  >
    <!-- FIXME: layout-compact : layout-normal -->
    <div
      class="app"
    >
      <IconBar />
      <AddBar v-if="showAddBar" />
      <Instances />
    </div>
  </div>
</template>

<script>
import IconBar from './components/IconBar.vue'
import Instances from './components/Instances.vue'
import AddBar from './components/AddBar.vue'

export default {
	name: 'App',
	components: {
		IconBar,
		Instances,
		AddBar,
	},
	computed: {
		showAddBar () {
			return this.$store.state.add.show
		},
		getTheme () {
			return this.$store.state.theme
		},
		getLayout () {
			return this.$store.state.layout
		},
	},
	created () {
		console.log('created App')
		this.$store.dispatch('getInstanceData')
	},
}
</script>

<style lang="scss">
@import "../scss/colors.scss";

.app {
	display: flex;
	flex-direction: column;
	padding: 0.5rem;
	min-width: 24rem;
	width: 26rem;
	max-width: 30rem;
	min-height: 32rem;

	.layout-compact & {
		padding: 0;
	}

	.dark & {
		background-color: $gray-900;
		color: white;
	}
}

</style>
