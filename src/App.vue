<template>
  <div
    class="flex flex-col w-96 p-2 overflow-y-scroll "
    style="height: 32rem"
  >
    <IconBar />
    <AddBar v-if="showAddBar" />
    <Instances />
  </div>
</template>


<script>
import IconBar from './components/IconBar.vue';
import Instances from './components/Instances.vue';
import AddBar from './components/AddBar.vue';

export default {
	name: 'App',
	components: {
		IconBar,
		Instances,
		AddBar
	},
	computed: {
		showAddBar() {
			return this.$store.state.add.show;
		}
	},
	created() {
		console.log('created App');
		this.$store.dispatch('getInstanceData');
	}
}
</script>

<style lang="sass">
</style>
