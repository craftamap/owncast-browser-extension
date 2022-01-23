import Vue from 'vue'
import OptionView from './OptionView.vue'
import '../scss/main.scss'
import Store from './store'

window.addEventListener('load', function (_) {
	Store.dispatch('getOptionsFromStorage').then(() => {
		window.app = new Vue({
			store: Store,
			el: '#app-root',
			render: h => h(OptionView),
		})
	})
})
