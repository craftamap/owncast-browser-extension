<template>
  <div
    id="theme-wrapper"
    :class="[theme === 'dark' ? 'dark' : 'light', layout === 'compact' ? 'layout-compact' : 'layout-normal' ]"
  >
    <!-- FIXME: layout-compact : layout-normal -->
    <div
      class="app"
    >
      <IconBar />
      <AddBar v-if="showAddBar" />
      <InstanceList />
    </div>
  </div>
</template>

<script>
import IconBar from './components/IconBar.vue'
import InstanceList from './components/InstanceList.vue'
import AddBar from './components/AddBar.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
	name: 'App',
	components: {
		IconBar,
		InstanceList,
		AddBar,
	},
	setup () {
		const store = useStore()

		console.log('created App')
		store.dispatch('getInstanceData')

		return {
			showAddBar: computed(() => store.state.add.show),
			theme: computed(() => store.state.theme),
			layout: computed(() => store.state.layout),
		}
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
