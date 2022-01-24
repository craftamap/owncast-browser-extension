import browser from 'webextension-polyfill'
import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'
import '../scss/main.scss'

window.addEventListener('load', function (_) {
	browser.runtime.onMessage.addListener((request) => {
		if (request.type === 'updatedInstanceData') {
			store.commit('setInstances', request.data.instances)
		}
	})

	store.dispatch('fetchThemeAndLayout').then(() => {
		const app = createApp(App)
		app.use(store)
		app.mount('#app-root')
	})
})
