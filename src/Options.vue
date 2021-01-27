<template>
  <form
    id="options"
    @submit="store"
  >
    <h1>
      Pop-Up and Notifications
    </h1> 
    <div class="form-section">
      <label>
        <div>pop-up theme</div>
        <select
          id="theme"
          v-model="theme"
          name="theme"
        >
          <option>dark</option>
          <option>light</option>
        </select>
      </label>
    </div>
    <div class="form-section">
      <input
        id="notifications"
        v-model="notifications"
        type="checkbox"
        name="notifications"
      >
      <label
        for="notifications"
      >Enable Notifications</label>
    </div>
    <div class="form-section">
      <input
        id="badge"
        v-model="badge"
        type="checkbox"
        name="badge"
      >
      <label
        for="badge"
      >Enable Badge</label>
    </div>
    <div>
      <label>
        <div>interval for background refresh</div>
        <input
          id="interval"
          v-model="interval"
          type="number"
          min="30"
          max="86400"
          name="interval"
        >
      </label>
    </div>
    <h1>
      Automatic Username
    </h1> 
    <div class="form-section">
      <label>
        <div>your username</div>
        <div class="description">this username will be automatically set on new owncast instances. Leave empty if you don't want to set a username automatically.</div>
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
      >
      <LoadingIcon 
        v-if="displayLoading"
      />
      <ErrorIcon 
        v-if="displayError"
      />
      <SuccessIcon
        v-if="displaySuccess"
      />
    </div>
  </form>
</template>

<script>
import LoadingIcon from './components/icons/LoadingIcon.vue';
import ErrorIcon from './components/icons/ErrorIcon.vue';
import SuccessIcon from './components/icons/SuccessIcon.vue';

export default {

	name:'Options',
	components: {
		LoadingIcon,
		ErrorIcon, 
		SuccessIcon,
	},
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

<style lang="scss">
@import "./scss/colors.scss";

html, body {
  min-height: 200px;
  min-width: 200px;
}

form {
  font-size: 1rem;
  line-height: 1.5rem;
  margin: 8;

  input[type='checkbox'] + label {
    margin-left: 1rem;
  }

  input[type='submit'] {
    background-color: $blue-600; 
    padding: 0.5rem 0;
    width: 8rem;
    margin: 0.5rem 0.5rem 0.5rem 0;
    border-radius: 0.25rem;
    color: white;

    &:active {
      background-color: $blue-800; 
    }
  }
}

h1 {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 700;
}

.form-section {
  display: flex;
  align-items:center;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: $gray-500;
}
</style>
