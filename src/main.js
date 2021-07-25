import browser from 'webextension-polyfill';
import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex'
import './scss/main.scss';

window.addEventListener('load', function (event) {
	Vue.use(Vuex);
	const store = new Vuex.Store({
		state: {
			instances: [],
			loading: false,
			add: {
				show: false,
				loading: false,
				success: false,
				error: false,
			}
		},
		mutations: {
			setTheme(state, theme) {
				state.theme = theme;
			},
			setLayout(state, layout) {
				state.layout = layout;
			},
			setLoading(state, newLoading) {
				state.loading = newLoading
			},
			toggleShowAddBar(state) {
				state.add.show = !state.add.show;
			},
			setInstances(state, instances) {
				state.instances = [...instances]
				console.log('set instances in state', instances)
			},
			setAddLoading(state) {
				state.add.loading = true;
				state.add.success = false;
				state.add.error = false;
			},
			setAddSuccess(state) {
				state.add.loading = false;
				state.add.success = true;
				state.add.error = false;
			},
			setAddError(state) {
				state.add.loading = false;
				state.add.success = false;
				state.add.error = true;
			},
			unsetAdd(state) {
				state.add.loading = false;
				state.add.success = false;
				state.add.error = false;
			}
		},
		actions: {
			fetchThemeAndLayout({commit}) {
				return browser.runtime.sendMessage({
					type: 'getSettings'
				}).then((options) => {
					return Promise.all([
						commit('setTheme', options.theme),
						commit('setLayout', options.layout),
					])
				})
			},
			updateInstanceData({commit}) {
				commit('setLoading', true);
				return browser.runtime.sendMessage({
					type: 'updateInstanceData',
				}).then((instances) => {
					commit('setInstances', instances)
					commit('setLoading', false);
				}).catch(() => {
					commit('setLoading', false);
				})
			},
			getInstanceData({commit}) {
				console.log('action setInstances')
				return browser.runtime.sendMessage({
					type: 'getInstanceData',
				}).then((instances) => {
					console.log('recieved instances', instances);
					commit('setInstances', instances)
				})
			},
			removeInstanceInStorage({commit, dispatch}, url) {
				return browser.runtime.sendMessage({
					type: 'removeInstanceInStorage',
					data: {
						url
					}
				}).then(() => {
					dispatch('updateInstanceData')
				});
			},
			checkConnectionAndAddInStorage({commit, dispatch}, url) {
				commit('setAddLoading');
				if (url.substr(-1) !== '/') {
					url = url + '/';
				}
				new Promise((res, rej) => {
					const urlObj = new URL(url);
					if (!(urlObj.protocol === 'http:' || urlObj.protocol === 'https:')) {
						rej('Wrong Protocol!')
					}
					console.log(url);
					res();
				}).then(() => {
					return browser.runtime.sendMessage({
						type: 'checkConnection', 
						data: {
							url: url
						}
					})
				}).then(() => {
					console.log('checkConnection was successful, now add Instance');
					return browser.runtime.sendMessage({
						type: 'addInstanceInStorage', 
						data: {
							url: url
						}
					})	
				}).then(() => {
					commit('setAddSuccess');
					return 'success';
				}).catch((reason) => {
					console.log(reason);
					commit('setAddError');
					return 'error';
				}).then((data) => {
					return new Promise((res) => {
						dispatch('updateInstanceData')
						setTimeout(() => {
							console.log('unset');
							commit('unsetAdd');
							if(data === 'success') {
								commit('toggleShowAddBar');
							}
							res();
						}, 3000);
					})	
				})
			}
		}
	})

	browser.runtime.onMessage.addListener((request) => {
		if (request.type === 'updatedInstanceData') {
			store.commit('setInstances', request.data.instances);
		}
	});
	
	store.dispatch('fetchThemeAndLayout').then(() => {
		window.app = new Vue({
			store: store,
			el: '#app-root',
			render: h => h(App)
		});
	});
});
