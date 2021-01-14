//import Instances from './templates/Instances.hbs';
import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex'
import './scss/main.scss';


function findParentBySelector(elm, selector) {
	const all = Array.prototype.slice.call(document.querySelectorAll(selector));
	let cur = elm.parentNode;
	while (cur && !all.includes(cur)) { //keep going up until you find a match
		cur = cur.parentNode; //go up
	}
	return cur; //will return null if not found
}

window.addEventListener('load', function (event) {
	async function getInstanceData() {
		return browser.runtime.sendMessage({
			type: 'getInstanceData',
		})	
	}
	//
	//	document.addEventListener('click', (e) => {
	//		if (e.target.closest('#refresh')) {
	//			refreshDataAndUI()
	//		}
	//	});
	//
	//	document.addEventListener('click', (e) => {
	//		if (e.target.closest('#add')) {
	//			console.log(e.target.classList);
	//			document.querySelector('#add-section').classList.toggle('hidden');
	//		}
	//	});
	//
	//	document.addEventListener('keyup', (e) => {
	//		if (document.querySelector('#add-url') === document.activeElement && e.key === 'Enter') {
	//			addFromInput(e);
	//		}
	//	})
	//
	//	document.addEventListener('click', (e) => {
	//		if (e.target.closest('#add-button')) {
	//			addFromInput(e);
	//		}
	//	}, true);
	//
	//	const addFromInput = (e) => {
	//		e.stopPropagation();
	//
	//		const url = document.querySelector('#add-url').value;
	//
	//		const addSection = document.querySelector('#add-section');
	//		const spinner = addSection.querySelector('#spinner');
	//		const addButton = addSection.querySelector('#add-button');
	//		const error = addSection.querySelector('#error');
	//		const success = addSection.querySelector('#success');
	//
	//		new Promise((res, rej) => {
	//			const urlObj = new URL(url);
	//			if (!(urlObj.protocol === 'http:' || urlObj.protocol === 'https:')) {
	//				rej('Wrong Protocol!')
	//			}
	//			console.error(e, url);
	//			console.log(url);
	//			spinner.classList.remove('hidden');
	//			addButton.classList.add('hidden');
	//			res();
	//		}).then(() => {
	//			return bgApp.checkConnection(url)
	//		}).then((_data) => {
	//			return bgApp.addInstanceInStorage(url)
	//		}).then(() => {
	//			spinner.classList.add('hidden');
	//			success.classList.remove('hidden');
	//			setTimeout(() => {
	//				success.classList.add('hidden');
	//				addButton.classList.remove('hidden');
	//				refreshDataAndUI()
	//			}, 3000);
	//		}).catch((reason) => {
	//			console.log(reason);
	//			spinner.classList.add('hidden');
	//			error.classList.remove('hidden')
	//			setTimeout(() => {
	//				error.classList.add('hidden')
	//				addButton.classList.remove('hidden');
	//			}, 3000);
	//		});
	//
	//	}
	//
	//	document.addEventListener('click', (e) => {
	//		if (e.target.closest('#show-remove')) {
	//			e.stopPropagation();
	//
	//			const showRemove = e.target;
	//			const instance = findParentBySelector(showRemove, '#instance')
	//
	//
	//			instance.querySelector('#delete-section').classList.toggle('hidden');
	//		}
	//	}, true);
	//
	//	document.addEventListener('click', (e) => {
	//		if (e.target.closest('#remove')) {
	//			e.stopPropagation();
	//
	//			const button = e.target;
	//			const instance = findParentBySelector(button, '#instance').dataset.instance;
	//			bgApp.removeInstanceInStorage(instance)
	//				.then(refreshDataAndUI)
	//
	//		}
	//	}, true);
	//
	//	refreshDataAndUI();
	

	Vue.use(Vuex);
	const store = new Vuex.Store({
		state: {
			instances: [],
			showAddBar: false,
		},
		mutations: {
			toggleShowAddBar(state) {
				state.showAddBar = !state.showAddBar;
			},
			setInstances(state, instances) {
				state.instances = [...instances]
				console.log('set instances in state', instances)
			},
		},
		actions: {
			update({commit}) {
				console.log('action setInstances')
				getInstanceData().then((instances) => {
					console.log('recieved instances', instances);
					commit('setInstances', instances)
				})
			}
		}
	})

	const app = new Vue({
		store: store,
		el: '#app-root',
		render: h => h(App)
	});
});
