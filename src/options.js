import browser from 'webextension-polyfill';
import Vue from 'vue';
import Vuex from 'vuex'
import Options from './Options.vue';
import './scss/main.scss';

window.addEventListener('load', function (event) {
	Vue.use(Vuex);
	const store = new Vuex.Store({
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
			}
		},
		mutations: {
			setDisplayLoading(state) {
				state.display.loading = true;
				state.display.success = false;
				state.display.error = false;
			},
			setDisplaySuccess(state) {
				state.display.loading = false;
				state.display.success = true;
				state.display.error = false;
			},
			setDisplayError(state) {
				state.display.loading = false;
				state.display.success = false;
				state.display.error = true;
			},
			unsetDisplay(state) {
				state.display.loading = false;
				state.display.success = false;
				state.display.error = false;
			},
			setOptions(state, options) {
				state.options = options;
				console.log('[setOptions]',state.options);
			},
			setBadge(state, badge) {
				state.options.badge = badge;
			},
			setNotifications(state, notifications) {
				state.options.notifications = notifications;
			},
			setInterval(state, interval) {
				state.options.interval = interval;
			},
			setUsername(state, username) {
				state.options.username = username;
			}
		},
		actions: {
			getOptionsFromStorage({commit}) {
				return browser.runtime.sendMessage({
					type: 'getSettings',
				}).then((options) => {
					console.log('[getOptionsFromStorage]',options);
					commit('setOptions', options);	
				})
			}
		}
	});

	store.dispatch('getOptionsFromStorage').then(() => {
		window.app = new Vue({
			store: store,
			el: '#app-root',
			render: h => h(Options)
		});
	});


})
