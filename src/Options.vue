<template>
  <form
    id="options"
    class="m-4"
    @submit="store"
  >
    <h1 class="font-bold text-lg">
      Pop-Up and Notifications
    </h1> 
    <div class="flex items-center  my-2">
      <input
        id="notifications"
        v-model="notifications"
        class="input-checkbox"
        type="checkbox"
        name="notifications"
      >
      <label
        class="ml-4"
        for="notifications"
      >Enable Notifications</label>
    </div>
    <div class="flex items-center my-2">
      <input
        id="badge"
        v-model="badge"
        class="input-checkbox"
        type="checkbox"
        name="badge"
      >
      <label
        class="ml-4"
        for="badge"
      >Enable Badge</label>
    </div>
    <div class="flex items-center my-2">
      <label>
        <div>interval for background refresh</div>
        <input
          id="interval"
          v-model="interval"
          class="input-number"
          type="number"
          min="30"
          max="86400"
          name="interval"
        >
      </label>
    </div>
    <div>
      <input
        type="submit"
        value="Save"
        class="bg-blue-600 active:bg-blue-800 py-2 w-32 my-2 rounded text-white"
      >
    </div>
  </form>
</template>

<script>
export default {
	name:'Options',
	computed: {
		badge: {
			get () {
				return this.$store.state.options.badge
			},
			set (value) {
				this.$store.commit('setBadge', value)
			}
		},
		notifications: {
			get () {
				return this.$store.state.options.notifications
			},
			set (value) {
				this.$store.commit('setNotifications', value)
			}
		},
		interval: {
			get () {
				return this.$store.state.options.interval
			},
			set (value) {
				this.$store.commit('setInterval', value)
			}
		}
	},	
	methods: {
		async store(e) {
			e.preventDefault();
			// Although not mutating, we should propably move this sendMessage to an
			// vuex action as well
			console.log('[store]',this.$store.state.options);
			return browser.runtime.sendMessage({
				type: 'storeSettings',
				data: {
					options: {...this.$store.state.options}
				}
			}).then(() => {
				this.$store.dispatch('getOptionsFromStorage')
			})
      
		}
	}
}
</script>
