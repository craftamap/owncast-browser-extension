import browser from 'webextension-polyfill'

/**
 * @typedef {'light'|'dark'} Theme
 * @typedef {'normal'|'compact'} Layout
 * @typedef {{ notifications: Boolean, badge: Boolean, interval: Number, theme: Theme, layout: Layout, username: String }} Options
 */

/**
 * @param {Options} options
 */
function setOptionsInStorage (options) {
	return browser.storage.local.set({ options: options })
}

/**
 * @returns {Promise<Options>}
 */
async function getOptionsFromStorage () {
	return browser.storage.local.get('options').then(({ options }) => {
		return Object.assign({
			notifications: true,
			badge: true,
			interval: 60,
			theme: 'light',
			layout: 'normal',
		}, (options || {}))
	})
}

/**
 * @returns {Promise<{ instances: String[] }>}
 */
async function getInstancesFromStorage () {
	return browser.storage.local.get('instances').then((/** @type {{instances?: String[]}} */ data) => {
		return {
			instances: [...((data && data.instances) || [])],
		}
	})
}

/**
 * @param {String[]} instances
 */
async function setInstancesInStorage (instances) {
	return browser.storage.local.set({
		instances: [...(instances || [])],
	})
}

/**
 * @param {String} instance
 */
async function addInstanceInStorage (instance) {
	return getInstancesFromStorage().then((data) => {
		return setInstancesInStorage(Array.from(new Set([...data.instances, instance])))
	})
}

/**
 * @param {String} instance
 */
async function removeInstanceInStorage (instance) {
	return getInstancesFromStorage().then((data) => {
		console.log('removeInstanceInStorage data', JSON.stringify(data))
		console.log('removeInstanceInStorage data', JSON.stringify(data.instances))
		const instances = new Set(data.instances)
		console.log('removeInstanceInStorage instances 1', JSON.stringify(Array.from(instances)))
		instances.delete(instance)
		console.log('removeInstanceInStorage instances 2', JSON.stringify(Array.from(instances)))
		console.log('removeInstanceInStorage instance', JSON.stringify(instance))
		return setInstancesInStorage(Array.from(instances))
	})
}

export default {
	setOptionsInStorage,
	getOptionsFromStorage,
	getInstancesFromStorage,
	setInstancesInStorage,
	addInstanceInStorage,
	removeInstanceInStorage,
}
