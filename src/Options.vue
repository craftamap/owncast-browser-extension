<template>
  <form
    id="options"
    class="m-8 text-base"
    @submit="store"
  >
    <h1 class="font-bold text-lg">
      Pop-Up and Notifications
    </h1> 
    <div class="flex items-center  my-2">
      <label>
        <div>pop-up theme</div>
        <select
          id="theme"
          v-model="theme"
          class="input-select"
          name="theme"
        >
          <option>dark</option>
          <option>light</option>
        </select>
      </label>
    </div>
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
    <h1 class="font-bold text-lg">
      Automatic Username
    </h1> 
    <div class="flex items-center my-2">
      <label>
        <div class="text-base">your username</div>
        <div class="text-sm text-gray-600">this username will be automatically set on new owncast instances. Leave empty if you don't want to set a username automatically.</div>
        <input
          id="username"
          v-model="username"
          class="input-text"
          type="text"
          name="username"
          placeholder="your username..."
        >
      </label>
    </div>
    <div class="flex items-center">
      <input
        type="submit"
        value="Save"
        class="bg-blue-600 active:bg-blue-800 py-2 w-32 my-2 rounded text-white mr-2"
      >
      <svg
        v-if="displayLoading"
        id="spinner"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4 animate-spin "
      >
        <path
          fill-rule="evenodd"
          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-if="displayError"
        id="error"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4 text-red-500"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-if="displaySuccess"
        id="success"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4 text-green-500"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </form>
</template>

<script>
export default {
	name:'Options',
	computed: {
		displayLoading() {
			return this.$store.state.display.loading;
		},
		displayError() {
			return this.$store.state.display.error;
		},
		displaySuccess() {
			return this.$store.state.display.success;
		},
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
		},
		username: {
			get () {
				return this.$store.state.options.username
			},
			set (value) {
				this.$store.commit('setUsername', value)
			}
		},
		theme: {
			get () {
				return this.$store.state.options.theme
			},
			set (value) {
				this.$store.commit('setTheme', value)
			}
		}
	},	
	methods: {
		async store(e) {
			e.preventDefault();
			return this.$store.dispatch('storeOptionsInStorage');
		}
	}
}
</script>

<style>
html, body {
  min-height: 200px;
  min-width: 200px;
}
</style>
