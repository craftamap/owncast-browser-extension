/**
 * @typedef Options
 * @type {object}
 * @prop {boolean} badge
 * @prop {boolean} notifications
 * @prop {number}  interval
 * @prop {string}  username
 *
 * @typedef Display
 * @type {object}
 * @prop {boolean} loading
 * @prop {boolean} success
 * @prop {boolean} error
 *
 * @typedef State
 * @type {object}
 * @prop {Display} display
 * @prop {Options} options
 * @prop {Array<String>} instances
 */

import browser from 'webextension-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import { generateExport, parseExport } from '../util/export-import'

Vue.use(Vuex)
export default new Vuex.Store({
	/** @type {State} */
	state: {
		display: {
			loading: false,
			success: false,
			error: false,
		},
		options: {
			badge: false,
			notifications: false,
			interval: 0,
			username: '',
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
		setOptions (state, options) {
			state.options = options
			console.log('[setOptions]', state.options)
		},
		setInstances (state, instances) {
			state.instances = instances
			console.log('[setInstances]', state.instances)
		},
		setBadge (state, badge) {
			state.options.badge = badge
		},
		setNotifications (state, notifications) {
			state.options.notifications = notifications
		},
		setInterval (state, interval) {
			state.options.interval = interval
		},
		setUsername (state, username) {
			state.options.username = username
		},
		setTheme (state, theme) {
			state.options.theme = theme
		},
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
				commit('setInstances', instances)
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
				link.download = 'owncast-browser-extension-export.json'
				link.href = url
				link.click()
				URL.revokeObjectURL(link.href)

				window.open(url, '_blank')
			})
		},
		async triggerImport ({ dispatch }, file) {
			const parsedExport = await parseExport(file)
			console.log(parsedExport)
		},
	},
})
