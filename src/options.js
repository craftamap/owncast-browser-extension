import browser from 'webextension-polyfill';
import Vue from 'vue';
import Vuex from 'vuex'
import Options from './Options.vue';
import './scss/main.scss';

window.addEventListener('load', function (event) {
	Vue.use(Vuex);
	const store = new Vuex.Store({
		state: {
			options: {
				badge: false,
				notifications: false,
				interval: 0,
			}
		},
		mutations: {
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
				state.options.interval= interval;
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
