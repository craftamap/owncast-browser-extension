import Instances from './templates/Instances.hbs';
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
	const bgApp = browser.extension.getBackgroundPage().bgApp;
	const root = document.getElementById('app-root');

	async function refreshDataAndUI() {
		return bgApp.refreshInstanceData().then((data) => {
			const instances = bgApp.instanceData;
			console.log(bgApp);
			root.innerHTML = Instances({
				instances: instances,
			});
		})
	}

	document.addEventListener('click', (e) => {
		if (e.target.closest('#refresh')) {
			refreshDataAndUI()
		}
	});

	document.addEventListener('click', (e) => {
		if (e.target.closest('#add')) {
			console.log(e.target.classList);
			document.querySelector('#add-section').classList.toggle('hidden');
		}
	});

	document.addEventListener('keyup', (e) => {
		if (document.querySelector('#add-url') === document.activeElement && e.key === 'Enter') {
			addFromInput(e);
		}
	})

	document.addEventListener('click', (e) => {
		if (e.target.closest('#add-button')) {
			addFromInput(e);
		}
	}, true);

	const addFromInput = (e) => {
		e.stopPropagation();

		const url = document.querySelector('#add-url').value;

		const addSection = document.querySelector('#add-section');
		const spinner = addSection.querySelector('#spinner');
		const addButton = addSection.querySelector('#add-button');
		const error = addSection.querySelector('#error');
		const success = addSection.querySelector('#success');

		new Promise((res, rej) => {
			const urlObj = new URL(url);
			if (!(urlObj.protocol === 'http:' || urlObj.protocol === 'https:')) {
				rej('Wrong Protocol!')
			}
			console.error(e, url);
			console.log(url);
			spinner.classList.remove('hidden');
			addButton.classList.add('hidden');
			res();
		}).then(() => {
			return bgApp.checkConnection(url)
		}).then((_data) => {
			return bgApp.addInstanceInStorage(url)
		}).then(() => {
			spinner.classList.add('hidden');
			success.classList.remove('hidden');
			setTimeout(() => {
				success.classList.add('hidden');
				addButton.classList.remove('hidden');
				refreshDataAndUI()
			}, 3000);
		}).catch((reason) => {
			console.log(reason);
			spinner.classList.add('hidden');
			error.classList.remove('hidden')
			setTimeout(() => {
				error.classList.add('hidden')
				addButton.classList.remove('hidden');
			}, 3000);
		});

	}

	document.addEventListener('click', (e) => {
		if (e.target.closest('#show-remove')) {
			e.stopPropagation();

			const showRemove = e.target;
			const instance = findParentBySelector(showRemove, '#instance')


			instance.querySelector('#delete-section').classList.toggle('hidden');
		}
	}, true);

	document.addEventListener('click', (e) => {
		if (e.target.closest('#remove')) {
			e.stopPropagation();

			const button = e.target;
			const instance = findParentBySelector(button, '#instance').dataset.instance;
			bgApp.removeInstanceInStorage(instance)
				.then(refreshDataAndUI)

		}
	}, true);

	refreshDataAndUI();
});
