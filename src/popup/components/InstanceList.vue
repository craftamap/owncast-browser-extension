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
import { useStore } from '../store'
import { computed, defineComponent } from 'vue'
import InstanceItem from './InstanceItem.vue'
import NoInstances from './NoInstances.vue'

export default defineComponent({
	name: 'InstanceList',
	components: {
		InstanceItem,
		NoInstances,
	},
	setup () {
		const store = useStore()

		return {
			instances: computed(() => store.instances),
		}
	},
})
</script>
