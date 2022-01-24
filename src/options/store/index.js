/**
 * @typedef Theme
 * @type {"dark"|"light"}
 * @typedef Layout
 * @type {"normal"|"compact"}
 *
 * @typedef Options
 * @type {object}
 * @prop {boolean} badge
 * @prop {boolean} notifications
 * @prop {number}  interval
 * @prop {string}  username
 * @prop {Theme}   theme
 * @prop {Layout}  layout
 *
 * @typedef Display
 * @type {object}
 * @prop {boolean} loading
 * @prop {boolean} success
 * @prop {boolean} error
 * @prop {boolean} dirty
 * @prop {string} importExportErrors
 *
 * @typedef State
 * @type {object}
 * @prop {Display} display
 * @prop {Options} options
 * @prop {Array<String>} instances
 */

import browser from 'webextension-polyfill'
import { createStore } from 'vuex'
import { generateExport, parseExport } from '../util/export-import'

export const store = createStore({
	/** @type {State} */
	state: {
		display: {
			loading: false,
			success: false,
			error: false,
			dirty: false,
			importExportErrors: '',
		},
		options: {
			badge: false,
			notifications: false,
			interval: 0,
			username: '',
			theme: '',
			layout: '',
		},
		instances: [],
	},
	mutations: {
		setDisplayLoading (state) {
			state.display.loading = true
			state.display.success = false
			state.display.error = false
		},
		setDisplaySuccess (state) {
			state.display.loading = false
			state.display.success = true
			state.display.error = false
		},
		setDisplayError (state) {
			state.display.loading = false
			state.display.success = false
			state.display.error = true
		},
		unsetDisplay (state) {
			state.display.loading = false
			state.display.success = false
			state.display.error = false
		},
		setDirty (state, dirtyness) {
			state.display.dirty = dirtyness
		},
		setImportExportErrors (state, errors) {
			state.display.importExportErrors = errors
		},
		setOptions (state, options) {
			state.options = options
			console.log('[setOptions]', state.options)
		},
		/** @param {Array<string>} instances */
		setInstances (state, instances) {
			state.instances = instances
			console.log('[setInstances]', state.instances)
		},
		/** @param {boolean} badge */
		setBadge (state, badge) {
			state.options.badge = badge
		},
		/** @param {boolean} notifications */
		setNotifications (state, notifications) {
			state.options.notifications = notifications
		},
		/** @param {number} interval */
		setInterval (state, interval) {
			state.options.interval = interval
		},
		/** @param {string} username */
		setUsername (state, username) {
			state.options.username = username
		},
		/** @param {Theme} theme */
		setTheme (state, theme) {
			state.options.theme = theme
		},
		/** @param {Layout} layout */
		setLayout (state, layout) {
			state.options.layout = layout
		},
	},
	actions: {
		async getOptionsFromStorage ({ commit }) {
			return browser.runtime.sendMessage({
				type: 'getSettings',
			}).then((options) => {
				console.log('[getOptionsFromStorage]', options)
				commit('setOptions', options)
			})
		},
		async getInstancesFromStorage ({ commit }) {
			return browser.runtime.sendMessage({
				type: 'getInstances',
			}).then((instances) => {
				console.log('[getInstancesFromStorage]', instances)
				commit('setInstances', instances.instances)
			})
		},
		async storeOptionsInStorage ({ commit, dispatch, state }) {
			// Although not mutating, we should propably move this sendMessage to an
			// vuex action as well
			console.log('[store]', state.options)
			commit('setDisplayLoading')
			return browser.runtime.sendMessage({
				type: 'storeSettings',
				data: {
					options: { ...state.options },
				},
			}).then(() => {
				return dispatch('getOptionsFromStorage')
			}).then(() => {
				return commit('setDisplaySuccess')
			}).then(() => {
				return commit('setDirty', false)
			}).catch(() => {
				return commit('setDisplayError')
			}).then(() => {
				return new Promise(() => {
					setTimeout(() => {
						commit('unsetDisplay')
					}, 3000)
				})
			})
		},
		async generateExport ({ commit, dispatch, state }) {
			return Promise.all([dispatch('getInstancesFromStorage'), dispatch('getOptionsFromStorage')]).then(() => {
				const exportDataBlob = generateExport(state)
				const url = URL.createObjectURL(exportDataBlob)
				const link = document.createElement('a')
				const date = new Date()
				link.download = `owncast-browser-extension-export-${date.toISOString().replaceAll(':', '-')}.json`
				link.href = url
				link.click()
				URL.revokeObjectURL(link.href)
				document.removeChild(link)

				window.open(url, '_blank')
			})
		},
		async triggerImport ({ commit, dispatch, state }, file) {
			commit('setImportExportErrors', '')
			try {
				const parsedExport = await parseExport(file)
				// for now, let's assume a export only contains existing owncast instances.
				parsedExport.instances.forEach((instance) => {
					browser.runtime.sendMessage({
						type: 'addInstanceInStorage',
						data: {
							url: instance,
						},
					})
				})
				// Let's merge current setting with the imported ones
				commit('setOptions', { ...state.options, ...parsedExport.options })
				dispatch('storeOptionsInStorage')
			} catch (e) {
				commit('setImportExportErrors', e)
			}
		},
	},
})
