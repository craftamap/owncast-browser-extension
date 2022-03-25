import browser from 'webextension-polyfill'
import { createApp } from 'vue'
import App from './App.vue'
import '../scss/main.scss'
import { createPinia } from 'pinia'
import { useStore } from './store'

window.addEventListener('load', function (_) {
	const pinia = createPinia()

	browser.runtime.onMessage.addListener((request) => {
		if (request.type === 'updatedInstanceData') {
			useStore().setInstances(request.data.instances)
		}
	})

	const app = createApp(App)
	app.use(pinia)
	app.mount('#app-root')

	useStore().fetchThemeAndLayout()
})
