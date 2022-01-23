<template>
  <div id="instances">
    <InstanceItem
      v-for="instance in instances"
      :key="instance.instance"
      :instance="instance"
    />
    <NoInstances v-if="instances.length == 0" />
  </div>
</template>

<script>
import InstanceItem from './InstanceItem.vue'
import NoInstances from './NoInstances.vue'

export default {
	name: 'InstanceList',
	components: {
		InstanceItem,
		NoInstances,
	},
	computed: {
		instances () {
			return this.$store.state.instances
		},
	},
}
</script>
