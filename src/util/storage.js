function setOptionsInStorage(options) {
	return chrome.storage.sync.set({options: options});
}

function getOptionsFromStorage() {
	return chrome.storage.sync.get('options');
}

function getInstancesFromStorage() {
	// TODO: Implement
	// TODO: Replace with actual data
	return new Promise((resolve, _reject) => {
		resolve({
			instances: [
				'https://watch.owncast.online/',
				'https://tv.grindhold.de/',
				'https://cast.craftam.app/',
				'https://cast.craftam.app/',
				'https://cast.craftam.app/',
				'https://cast.craftam.app/',
				'https://cast.craftam.app/',
				'https://cast.craftam.app/',
			],
		})
	})
}


function setInstancesFromStorage() {
	// TODO: Implement
	return new Promise();
}


export default {
	setOptionsInStorage,
	getOptionsFromStorage,
	getInstancesFromStorage,
	setInstancesFromStorage,
};
