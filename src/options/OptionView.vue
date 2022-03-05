<template>
  <div class="options-wrapper">
    <h1>Options</h1>
    <form
      id="options"
      @submit="storeSettings"
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
          class="icon"
        />
        <ErrorIcon
          v-if="displayError"
          class="icon"
        />
        <SuccessIcon
          v-if="displaySuccess"
          class="icon"
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
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

export default {
	name: 'OptionView',
	components: {
		LoadingIcon,
		ErrorIcon,
		SuccessIcon,
	},
	setup () {
		const store = useStore()

		const setDirty = () => {
			store.commit('setDirty', true)
		}

		const badge = computed({
			get: () => store.state.options.badge,
			set: (value) => {
				store.commit('setBadge', value)
				setDirty()
			},
		})

		const notifications = computed({
			get: () => store.state.options.notifications,
			set: (value) => {
				store.commit('setNotifications', value)
				setDirty()
			},
		})

		const interval = computed({
			get: () => store.state.options.interval,
			set: (value) => {
				store.commit('setInterval', value)
				setDirty()
			},
		})

		const username = computed({
			get: () => store.state.options.username,
			set: (value) => {
				store.commit('setUsername', value)
				setDirty()
			},
		})

		const theme = computed({
			get: () => store.state.options.theme,
			set: (value) => {
				store.commit('setTheme', value)
				setDirty()
			},
		})

		const layout = computed({
			get: () => store.state.options.layout,
			set: (value) => {
				store.commit('setLayout', value)
				setDirty()
			},
		})

		const storeSettings = (e) => {
			e.preventDefault()
			return store.dispatch('storeOptionsInStorage')
		}
		const reset = (e) => {
			e.preventDefault()
			store.dispatch('getOptionsFromStorage')
		}

		const triggerExport = (e) => {
			e.preventDefault()
			store.dispatch('generateExport')
		}
		const importFile = ref(null)
		const triggerImport = (e) => {
			e.preventDefault()
			/** @type {HTMLInputElement} */
			if (importFile.value.files.length > 0) {
				store.dispatch('triggerImport', importFile.value.files[0])
			}
		}

		return {
			displayLoading: computed(() => store.state.display.loading),
			displayError: computed(() => store.state.display.error),
			displaySuccess: computed(() => store.state.display.success),
			importExportErrors: computed(() => store.state.display.importExportErrors),
			isDirty: computed(() => store.state.display.dirty),
			importFile,
			badge,
			notifications,
			interval,
			username,
			theme,
			layout,
			storeSettings,
			reset,
			triggerExport,
			triggerImport,
		}
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
