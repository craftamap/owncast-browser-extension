<template>
  <!-- theme names must be directly in here, otherwise they get trimmed
       TODO: add themes to not-trim list -->
  <div
    id="theme-wrapper"
    :class="[getTheme === 'dark' ? 'dark' : 'light' ]"
  >
    <div
      class="flex flex-col w-96 p-2 overflow-y-scroll dark:bg-gray-900 dark:text-white"
      style="height: 32rem"
    >
      <IconBar />
      <AddBar v-if="showAddBar" />
      <Instances />
    </div>
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
		},
		getTheme() {
			return this.$store.state.theme;
		}
	},
	created() {
		console.log('created App');
		this.$store.dispatch('getInstanceData');
	}
}
</script>
