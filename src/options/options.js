import { createApp } from 'vue'
import { createPinia } from 'pinia'
import OptionView from './OptionView.vue'
import '../scss/main.scss'
import { useStore } from './store'

window.addEventListener('load', function (_) {
	const pinia = createPinia()

	const app = createApp(OptionView)
	app.use(pinia)
	useStore().getOptionsFromStorage().then(() => {
		app.mount('#app-root')
	})
})
