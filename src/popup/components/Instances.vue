<template>
  <div id="instances">
    <Instance
      v-for="instance in instances"
      :key="instance.instance"
      :instance="instance"
    />
    <NoInstances v-if="instances.length == 0" />
  </div>
</template>

<script>
import Instance from './Instance.vue'
import NoInstances from './NoInstances.vue'

export default {
	name: 'Instances',
	components: {
		Instance,
		NoInstances,
	},
	computed: {
		instances () {
			return this.$store.state.instances
		},
	},
}
</script>
