import Instances from './Instances.hbs';
import './main.scss';


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

	document.addEventListener('click', (e) => {
		if (e.target.closest('#add-button')) {
			e.stopPropagation();
			const url = document.querySelector('#add-url').value;
			try {
				const urlObj = new URL(url);
				if (urlObj.protocol !== 'http' || urlObj.protocol !== 'https') {
					throw new Error();
				}
			} catch (e) {
				console.err(e)
			}
			console.log(url);
			bgApp.addInstanceInStorage(url).then(refreshDataAndUI);
		}
	}, true);

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
