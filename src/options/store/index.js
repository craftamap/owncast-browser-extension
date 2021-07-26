import browser from 'webextension-polyfill';
import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
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
			console.log('[setOptions]', state.options);
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
		},
		setTheme(state, theme) {
			state.options.theme = theme;
		},
		setLayout(state, layout) {
			state.options.layout = layout;
		},
	},
	actions: {
		async getOptionsFromStorage({ commit }) {
			return browser.runtime.sendMessage({
				type: 'getSettings',
			}).then((options) => {
				console.log('[getOptionsFromStorage]', options);
				commit('setOptions', options);
			})
		},
		async storeOptionsInStorage({ commit, dispatch, state }) {
			// Although not mutating, we should propably move this sendMessage to an
			// vuex action as well
			console.log('[store]', state.options);
			commit('setDisplayLoading');
			return browser.runtime.sendMessage({
				type: 'storeSettings',
				data: {
					options: { ...state.options }
				}
			}).then(() => {
				return dispatch('getOptionsFromStorage')
			}).then(() => {
				return commit('setDisplaySuccess')
			}).catch(() => {
				return commit('setDisplayError')
			}).then(() => {
				new Promise((res) => {
					setTimeout(() => {
						commit('unsetDisplay')
						res();
					}, 3000);
				})
			})

		}
	}
});

