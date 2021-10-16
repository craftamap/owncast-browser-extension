import Vue from 'vue'
import Vuex from 'vuex'
import browser from 'webextension-polyfill'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		instances: [],
		loading: false,
		add: {
			show: false,
			loading: false,
			success: false,
			error: false,
		},
	},
	mutations: {
		setTheme (state, theme) {
			state.theme = theme
		},
		setLayout (state, layout) {
			state.layout = layout
		},
		setLoading (state, newLoading) {
			state.loading = newLoading
		},
		toggleShowAddBar (state) {
			state.add.show = !state.add.show
		},
		setInstances (state, instances) {
			state.instances = [...instances]
			console.log('set instances in state', instances)
		},
		setAddLoading (state) {
			state.add.loading = true
			state.add.success = false
			state.add.error = false
		},
		setAddSuccess (state) {
			state.add.loading = false
			state.add.success = true
			state.add.error = false
		},
		setAddError (state) {
			state.add.loading = false
			state.add.success = false
			state.add.error = true
		},
		unsetAdd (state) {
			state.add.loading = false
			state.add.success = false
			state.add.error = false
		},
	},
	actions: {
		async fetchThemeAndLayout ({ commit }) {
			console.log('fetch')
			return browser.runtime.sendMessage({
				type: 'getSettings',
			}).then((options) => {
				return Promise.all([
					commit('setTheme', options.theme),
					commit('setLayout', options.layout),
				])
			})
		},
		async updateInstanceData ({ commit }) {
			commit('setLoading', true)
			return browser.runtime.sendMessage({
				type: 'updateInstanceData',
			}).then((instances) => {
				commit('setInstances', instances)
				commit('setLoading', false)
			}).catch(() => {
				commit('setLoading', false)
			})
		},
		async getInstanceData ({ commit }) {
			console.log('action setInstances')
			return browser.runtime.sendMessage({
				type: 'getInstanceData',
			}).then((instances) => {
				console.log('recieved instances', instances)
				commit('setInstances', instances)
			})
		},
		async removeInstanceInStorage ({ dispatch }, url) {
			return browser.runtime.sendMessage({
				type: 'removeInstanceInStorage',
				data: {
					url,
				},
			}).then(() => {
				dispatch('updateInstanceData')
			})
		},
		async checkConnectionAndAddInStorage ({ commit, dispatch }, url) {
			commit('setAddLoading')
			if (url.substr(-1) !== '/') {
				url = url + '/'
			}
			return new Promise((resolve, reject) => {
				const urlObj = new URL(url)
				if (!(urlObj.protocol === 'http:' || urlObj.protocol === 'https:')) {
					reject(new Error('Wrong Protocol!'))
				}
				console.log(url)
				resolve()
			}).then(() => {
				return browser.runtime.sendMessage({
					type: 'checkConnection',
					data: {
						url: url,
					},
				})
			}).then(() => {
				console.log('checkConnection was successful, now add Instance')
				return browser.runtime.sendMessage({
					type: 'addInstanceInStorage',
					data: {
						url: url,
					},
				})
			}).then(() => {
				commit('setAddSuccess')
				return 'success'
			}).catch((reason) => {
				console.log(reason)
				commit('setAddError')
				return 'error'
			}).then((data) => {
				return new Promise((resolve) => {
					dispatch('updateInstanceData')
					setTimeout(() => {
						console.log('unset')
						commit('unsetAdd')
						if (data === 'success') {
							commit('toggleShowAddBar')
						}
						resolve()
					}, 3000)
				})
			})
		},
	},
})
