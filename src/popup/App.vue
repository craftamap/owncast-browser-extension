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
import { useStore } from './store'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'App',
	components: {
		IconBar,
		InstanceList,
		AddBar,
	},
	setup () {
		const store = useStore()

		console.log('created App')
		store.getInstanceData()

		return {
			showAddBar: computed(() => store.add.show),
			theme: computed(() => store.theme),
			layout: computed(() => store.layout),
		}
	},
})
</script>

<style lang="scss">
@import "../scss/colors.scss";

.app {
	display: flex;
	flex-direction: column;
	padding: 0.5rem;
	height: 34rem;
	min-width: 24rem;
	max-width: 26rem;
	overflow-y: scroll;

	.layout-compact & {
		padding: 0;
	}

	.dark & {
		background-color: $gray-900;
		color: white;
	}
}
</style>
