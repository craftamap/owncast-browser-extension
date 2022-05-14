import browser from 'webextension-polyfill'

type Theme = 'light' | 'dark'
type Layout = 'normal' | 'compact'
type Options = {notifications: boolean, badge: boolean, interval: number, theme: Theme, layout: Layout, username: string}

function setOptionsInStorage (options: Options) {
	return browser.storage.local.set({ options: options })
}

async function getOptionsFromStorage (): Promise<Options> {
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

async function getInstancesFromStorage (): Promise<{ instances: string[]}> {
	return browser.storage.local.get('instances').then((data) => {
		return {
			instances: [...((data && data.instances) || [])],
		}
	})
}

async function setInstancesInStorage (instances: string[]) {
	return browser.storage.local.set({
		instances: [...(instances || [])],
	})
}

async function addInstanceInStorage (instance: string) {
	return getInstancesFromStorage().then((data) => {
		return setInstancesInStorage(Array.from(new Set([...data.instances, instance])))
	})
}

async function removeInstanceInStorage (instance: string) {
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
