function setOptionsInStorage(options) {
	return browser.storage.local.set({options: options});
}

function getOptionsFromStorage() {
	return browser.storage.local.get('options').then(({options}) => {
		return Object.assign({
			notifications: true,
			badge: true,
			interval: 60,
		}, (options|| {}));
	});
}

function getInstancesFromStorage() {
	// TODO: Implement
	// TODO: Replace with actual data
	return browser.storage.local.get('instances').then((data) => {
		return {
			instances: [...((data && data.instances) || [])]
		}})	
}


function setInstancesInStorage(instances) {
	return browser.storage.local.set({
		instances: [...(instances || [])],
	})
}

async function addInstanceInStorage(instance) {
	return getInstancesFromStorage().then((data) => {
		return setInstancesInStorage(Array.from(new Set([...data['instances'],	instance])));
	})
}

async function removeInstanceInStorage(instance) {
	return getInstancesFromStorage().then((data) => {
		console.log('removeInstanceInStorage data',JSON.stringify(data));
		console.log('removeInstanceInStorage data',JSON.stringify(data['instances']));
		const instances = new Set(data['instances']);
		console.log('removeInstanceInStorage instances 1',JSON.stringify(Array.from(instances)));
		instances.delete(instance);
		console.log('removeInstanceInStorage instances 2',JSON.stringify(Array.from(instances)));
		console.log('removeInstanceInStorage instance',JSON.stringify(instance));
		return setInstancesInStorage(Array.from(instances));
	})
}


export default {
	setOptionsInStorage,
	getOptionsFromStorage,
	getInstancesFromStorage,
	setInstancesInStorage,
	addInstanceInStorage,
	removeInstanceInStorage,
};
