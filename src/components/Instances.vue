<template>
  <div id="instances">
    <Instance
      v-for="instance in instances"
      :key="instance.instance"
    />
  </div>
</template>

<script>
import Instance from './Instance.vue';

export default {
	name:'Instances',
	components: {
		Instance
	},
	computed: {
		instances() {
			return this.$store.state.instances;
		}
	}
}
</script>
