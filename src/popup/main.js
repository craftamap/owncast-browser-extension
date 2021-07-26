import browser from 'webextension-polyfill';
import Vue from 'vue';
import App from './App.vue';
import Store from './store';
import '../scss/main.scss';

window.addEventListener('load', function (_) {
	browser.runtime.onMessage.addListener((request) => {
		if (request.type === 'updatedInstanceData') {
			Store.commit('setInstances', request.data.instances);
		}
	});
	
	Store.dispatch('fetchThemeAndLayout').then(() => {
		window.app = new Vue({
			store: Store,
			el: '#app-root',
			render: h => h(App)
		});
	});
});
