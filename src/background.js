import api from './api/owncast';
import Storage from './util/storage';

const refreshInstanceData = async () => {
	const instances = await Storage.getInstancesFromStorage();
	const statuses = await Promise.allSettled(instances['instances'].map(async (instance) => {
		const cast = new api.OwnCast(instance);
		const status = await cast.getStatus();
		const config = await cast.getConfig();
		return {
			'name': config.name,
			'description': config.summary.substring(0, 61),
			'viewer': status.viewerCount,
			'status': status.online ? 'online' : 'offline',
			'online': status.online,
			'thumbnail': instance + 'thumbnail.jpg',
			'logo': config.logo,
			instance,
		};
	}));
	console.log(statuses);
	window.bgApp.instanceData = statuses
		.filter((a) => !!a.value)
		.map((a) => a.value)
		.sort((a,b) => b.online-a.online);

	return window.bgApp.instanceData;
};

window.addEventListener('load', function (event) {
	window.bgApp = {
		refreshInstanceData,
		'addInstanceInStorage': Storage.addInstanceInStorage,
		'removeInstanceInStorage': Storage.removeInstanceInStorage,
	};

	const recursiveRefresh = () => {
		refreshInstanceData().then(() => {
		});
		setTimeout(recursiveRefresh, 30000);
	};
	recursiveRefresh();
})
