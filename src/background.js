import browser from 'webextension-polyfill';
import api from './api/owncast';
import Storage from './util/storage';
import urlcat from 'urlcat';

const refreshInstanceData = async () => {
	const instances = await Storage.getInstancesFromStorage();
	const statuses = await Promise.allSettled(instances['instances'].map(async (instance) => {
		const cast = new api.OwnCast(instance);
		const status = await cast.getStatus();
		const config = await cast.getConfig();
		
		const logoIsAbsolute = (/^https?:\/\//i).test(config.logo);

		return {
			'name': config.name,
			'description': config.summary.length > 61
				? config.summary.substring(0, 61) + '...' : config.summary,
			'viewer': status.viewerCount,
			'status': status.online ? 'online' : 'offline',
			'online': status.online,
			'thumbnail': instance + 'thumbnail.jpg',
			'logo':  logoIsAbsolute ? config.logo : urlcat(instance, config.logo),
			instance,
		};
	}));
	console.log('[refreshInstanceData]', statuses);
	const newInstanceData = statuses
		.filter((a) => !!a.value)
		.map((a) => a.value)
		.sort((a, b) => b.online - a.online);
	const oldData = [...window.bgApp.instanceData || []];

	await sendNotifications(oldData || [], newInstanceData);

	window.bgApp.instanceData = newInstanceData;

	await setBadge(window.bgApp.instanceData);

	return newInstanceData;
};

const sendNotifications = async (oldData, newData) => {
	const options = await Storage.getOptionsFromStorage();
	if (options.notifications) {
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
				title: item.name + ' is online',
				message: item.description,
				iconUrl: item.logo,
			})
		})

		console.log('[sendNotifications]', newInstances);
	}
}

const setBadge = async (instanceData) => {
	const options = await Storage.getOptionsFromStorage();
	if (options.badge) {
		const online = instanceData.filter((a) => {return a.online});
		await browser.browserAction.setBadgeBackgroundColor({color: '#3d007a'});
		await browser.browserAction.setBadgeText({text: `${online.length}`});
	} else {
		await browser.browserAction.setBadgeText({text: ''});
	}
};

const checkConnection = (request, sender, sendResponse) => {
	if (request.type === 'checkConnection') {
		console.log('[checkConnection]', request.data.url);
		const cast = new api.OwnCast(request.data.url);
		return cast.getConfig();
	}
}

function getInstanceData(request, sender, sendResponse) {
	if (request.type === 'getInstanceData') {
		return Promise.resolve(window.bgApp.instanceData || []);
	}
}


function updateInstanceData(request, sender, sendResponse) {
	if (request.type === 'updateInstanceData') {
		console.log('[updateInstanceData] before',);
		return refreshInstanceData()
	}
}

function removeInstanceInStorage(request, sender, sendResponse) {
	if (request.type === 'removeInstanceInStorage') {
		return Storage.removeInstanceInStorage(request.data.url)
	}
}

function addInstanceInStorage(request, sender, sendResponse) {
	if (request.type === 'addInstanceInStorage') {
		return Storage.addInstanceInStorage(request.data.url);
	}
}

function followButtonGetStatus(request, sender, sendResponse) {
	if (request.type === 'getStatus') {
		const url = request.data.url
		return Storage.getInstancesFromStorage().then((res) => {
			const instances = res['instances'];
			const incl = instances.includes(url);
			return incl;
		})
	}
}

function followButtonFollow(request, sender, sendResponse) {
	if (request.type === 'follow') {
		console.log('[followButtonFollow]',request.data.url);
		const cast = new api.OwnCast(request.data.url);
		cast.getConfig().then(() => {
			return Storage.addInstanceInStorage(request.data.url)
		}).then(refreshInstanceData)
			.then(() => 'success')
	}
}

const followButtonUnfollow = (request, sender, sendResponse) => {
	if (request.type === 'unfollow') {
		Storage.removeInstanceInStorage(request.data.url)
			.then(refreshInstanceData)
			.catch(console.log)
			.then(() => 'success')
	}
};

function getSettings(request) {
	if (request.type === 'getSettings') {
		console.log('[getSettings]');
		return Storage.getOptionsFromStorage();
	}
}

function storeSettings(request) {
	if (request.type === 'storeSettings') {
		console.log('[storeSettings]');
		console.log('[storeSettings]', request.data.options);
		return Storage.setOptionsInStorage(request.data.options);
	}
}

window.addEventListener('load', function (event) {

	window.bgApp = {
		instanceData: [],
	};

	browser.runtime.onMessage.addListener(getInstanceData);
	browser.runtime.onMessage.addListener(updateInstanceData);
	browser.runtime.onMessage.addListener(checkConnection);
	browser.runtime.onMessage.addListener(removeInstanceInStorage);
	browser.runtime.onMessage.addListener(addInstanceInStorage);
	/* add-follow-button */
	browser.runtime.onMessage.addListener(followButtonGetStatus);
	browser.runtime.onMessage.addListener(followButtonFollow);
	browser.runtime.onMessage.addListener(followButtonUnfollow);
	/* settings */
	browser.runtime.onMessage.addListener(getSettings);
	browser.runtime.onMessage.addListener(storeSettings);

	const recursiveRefresh = () => {
		refreshInstanceData().then((data) => {
			return browser.runtime.sendMessage({
				type:'updatedInstanceData',
				data: {
					instances: data
				}
			});
		}).catch((reason) => {
			console.warn(reason)
		}).then(() => {
			return Storage.getOptionsFromStorage();
		}).then((options) => {
			const interval = options.interval * 1000;
			console.log(`[refreshInstanceData] done! Next exec in ${interval} ms`)
			setTimeout(recursiveRefresh, interval);
		});
	};
	recursiveRefresh();
})
