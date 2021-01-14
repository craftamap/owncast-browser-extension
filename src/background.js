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
			'description': config.summary.length > 61
				? config.summary.substring(0, 61) + '...' : config.summary,
			'viewer': status.viewerCount,
			'status': status.online ? 'online' : 'offline',
			'online': status.online,
			'thumbnail': instance + 'thumbnail.jpg',
			'logo': config.logo,
			instance,
		};
	}));
	console.log(statuses);
	const newInstanceData = statuses
		.filter((a) => !!a.value)
		.map((a) => a.value)
		.sort((a, b) => b.online - a.online);
	const oldData =  [...window.bgApp.instanceData || [] ];

	await sendNotifications(oldData || [], newInstanceData);

	window.bgApp.instanceData = newInstanceData;

	await setBadge(window.bgApp.instanceData);

	return newInstanceData;
};

const sendNotifications = async (oldData, newData) => {
	const oldUrls = new Set(oldData.filter((a) => {return a.online}).map(x => x.instance));
	const newInstances = {};
	const newDiff = [];
	for (const instance of newData.filter((a) => {return a.online})) {
		newInstances[instance.instance] = instance;
	}
	for (const instanceUrl of Object.keys(newInstances)) {
		if (!oldUrls.has(instanceUrl)) {
			newDiff.push(newInstances[instanceUrl]);
		}
	}

	newDiff.forEach((item) => {
		browser.notifications.create({
			type: 'basic',
			title: item.name+ ' is online',
			message: item.description,
			iconUrl: item.logo,
		})
	})
	
	console.log(newInstances);
}

const setBadge = async (instanceData) => {
	const online = instanceData.filter((a) => {return a.online});
	await browser.browserAction.setBadgeText({text: `${online.length}`});
	await browser.browserAction.setBadgeBackgroundColor({color: '#3d007a'});
};

const checkConnection = async (instanceUrl) => {
	const cast = new api.OwnCast(instanceUrl);
	return await cast.getConfig();
}

function getInstanceData(request, sender, sendResponse) {
	if(request.type === 'getInstanceData') {
		sendResponse(window.bgApp.instanceData || []);
	}
}


function updateInstanceData(request, sender, sendResponse) {
	if(request.type === 'update') {
		refreshInstanceData().then((
		) => {
			sendResponse(window.bgApp.instanceData || []);
		})
	}

}

window.addEventListener('load', function (event) {
	browser.runtime.onMessage.addListener(getInstanceData);
	browser.runtime.onMessage.addListener(updateInstanceData);

	window.bgApp = {
		'addInstanceInStorage': Storage.addInstanceInStorage,
		'removeInstanceInStorage': Storage.removeInstanceInStorage,
		checkConnection: checkConnection,
		refreshInstanceData,
	};

	const recursiveRefresh = () => {
		refreshInstanceData().then(() => {
		});
		setTimeout(recursiveRefresh, 30000);
	};
	recursiveRefresh();
})
