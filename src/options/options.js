import { createApp } from 'vue'
import OptionView from './OptionView.vue'
import '../scss/main.scss'
import { store } from './store'

window.addEventListener('load', function (_) {
	const app = createApp(OptionView)
	app.use(store)
	store.dispatch('getOptionsFromStorage').then(() => {
		app.mount('#app-root')
	})
})
