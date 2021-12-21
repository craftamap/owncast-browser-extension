<template>
  <div class="options-wrapper">
    <h1>Options</h1>
    <form
      id="options"
      @submit="store"
      @reset="reset"
    >
      <h2>
        Pop-Up and Notifications
      </h2>
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
        <label>
          <div>pop-up layout</div>
          <select
            id="layout"
            v-model="layout"
            name="layout"
          >
            <option>normal</option>
            <option>compact</option>
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
      <h2>
        Automatic Username
      </h2>
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
      <div>
        <input
          :disabled="!isDirty"
          type="submit"
          value="Save"
        >
        <input
          :disabled="!isDirty"
          type="reset"
          value="Reset Changes"
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
    <h1>Export & Import</h1>
    <p>The extension allows you to export your current options as well as your subscribed instances and re-import them.</p>
    <div>
      <div class="export">
        <input
          :disabled="isDirty"
          :title="isDirty ? 'you need to save your options first in order to export.' : ''"
          type="button"
          value="Export"
          @click="triggerExport"
        >
      </div>
      <div class="import">
        <input
          ref="importFile"
          type="file"
        >
        <input
          :disabled="isDirty"
          type="button"
          value="Import"
          @click="triggerImport"
        >
      </div>
      <div>
        {{ importExportErrors }}
      </div>
    </div>
  </div>
</template>

<script>
import LoadingIcon from '../shared/components/icons/LoadingIcon.vue'
import ErrorIcon from '../shared/components/icons/ErrorIcon.vue'
import SuccessIcon from '../shared/components/icons/SuccessIcon.vue'

export default {
	name: 'Options',
	components: {
		LoadingIcon,
		ErrorIcon,
		SuccessIcon,
	},
	computed: {
		displayLoading () {
			return this.$store.state.display.loading
		},
		displayError () {
			return this.$store.state.display.error
		},
		displaySuccess () {
			return this.$store.state.display.success
		},
		importExportErrors () {
			return this.$store.state.display.importExportErrors
		},
		isDirty () {
			return this.$store.state.display.dirty
		},
		badge: {
			get () {
				return this.$store.state.options.badge
			},
			set (value) {
				this.$store.commit('setBadge', value)
				this.$store.commit('setDirty', true)
			},
		},
		notifications: {
			get () {
				return this.$store.state.options.notifications
			},
			set (value) {
				this.$store.commit('setNotifications', value)
				this.$store.commit('setDirty', true)
			},
		},
		interval: {
			get () {
				return this.$store.state.options.interval
			},
			set (value) {
				this.$store.commit('setInterval', Number(value))
				this.$store.commit('setDirty', true)
			},
		},
		username: {
			get () {
				return this.$store.state.options.username
			},
			set (value) {
				this.$store.commit('setUsername', value)
				this.$store.commit('setDirty', true)
			},
		},
		theme: {
			get () {
				return this.$store.state.options.theme
			},
			set (value) {
				this.$store.commit('setTheme', value)
				this.$store.commit('setDirty', true)
			},
		},
		layout: {
			get () {
				return this.$store.state.options.layout
			},
			set (value) {
				this.$store.commit('setLayout', value)
				this.$store.commit('setDirty', true)
			},
		},
	},
	methods: {
		async store (e) {
			e.preventDefault()
			return this.$store.dispatch('storeOptionsInStorage')
		},
		async reset (e) {
			e.preventDefault()
			return this.$store.dispatch('getOptionsFromStorage')
		},
		async triggerExport (e) {
			e.preventDefault()
			this.$store.dispatch('generateExport')
		},
		async triggerImport (e) {
			e.preventDefault()
			/** @type {HTMLInputElement} */
			const importFile = this.$refs.importFile
			if (importFile.files.length > 0) {
				this.$store.dispatch('triggerImport', importFile.files[0])
			}
		},
	},
}
</script>

<style lang="scss">
@import "../scss/colors.scss";

html, body {
	min-height: 200px;
	min-width: 200px;
}

.options-wrapper {
	font-size: 1rem;
	line-height: 1.5rem;
	margin: 2rem;
}

input[type='checkbox'] + label {
	margin-left: 1rem;
}

input[type='submit'],input[type='button'],input[type='reset'] {
	padding: 0.5rem 0;
	width: 8rem;
	margin: 0.5rem 0.5rem 0.5rem 0;
	border-radius: 0.25rem;

	&[type='submit'] {
		background-color: $blue-600;
		color: white;
		&:disabled {
			background-color: $blue-400;
			color: gray;
		}

		&:active {
			background-color: $blue-800;
		}
	}
}

h1 {
	font-size: 1.25rem;
	line-height: 2rem;
	font-weight: 700;
}

h2 {
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

.export {
	display: flex;
	justify-content: flex-end;
}

.import {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
