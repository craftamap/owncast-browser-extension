import Instances from './Instances.hbs';
import './main.scss';

window.addEventListener('load', function (event) {
	const bgApp = browser.extension.getBackgroundPage().bgApp;

	const root = document.getElementById('app-root');

	document.addEventListener('click', (e) => {
		console.log(e.target.id);
		if (e.target.id === 'refresh') {
			bgApp.refreshInstanceData().then((data) => {
				const instances = bgApp.instanceData;
				console.log(bgApp);
				root.innerHTML = Instances({
					instances: instances,
				});

			})
		}
	});

	document.addEventListener('click', (e) => {
		console.log(e.target.id);
		if (e.target.id === 'add') {
			console.log(e.target.classList);
			document.querySelector('#add-section').classList.toggle('hidden');

//			bgApp.refreshInstanceData().then((data) => {
//				const instances = bgApp.instanceData;
//				console.log(bgApp);
//				root.innerHTML = Instances({
//					instances: instances,
//				});
//
//			})
		}
	});

	const instances = bgApp.instanceData;
	console.log(bgApp);
	root.innerHTML = Instances({
		instances: instances,
	});
});
