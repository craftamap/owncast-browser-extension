import browser from 'webextension-polyfill'
import { v4 as uuid } from 'uuid'

type Theme = 'light' | 'dark'
type Layout = 'normal' | 'compact'
type Options = {notifications: boolean, badge: boolean, interval: number, theme: Theme, layout: Layout, username: string}

export function setOptionsInStorage (options: Options) {
	return browser.storage.local.set({ options: options })
}

export async function getOptionsFromStorage (): Promise<Options> {
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

export async function getInstancesFromStorage (): Promise<{ instances: string[]}> {
	return browser.storage.local.get('instances').then((data) => {
		return {
			instances: [...((data && data.instances) || [])],
		}
	})
}

export async function setInstancesInStorage (instances: string[]) {
	return browser.storage.local.set({
		instances: [...(instances || [])],
	})
}

export async function addInstanceInStorage (instance: string) {
	return getInstancesFromStorage().then((data) => {
		return setInstancesInStorage(Array.from(new Set([...data.instances, instance])))
	})
}

export async function removeInstanceInStorage (instance: string) {
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

export async function getExternalInstanceProviders (): Promise<Record<string, any>> {
	const response = await browser.storage.local.get({ externalInstanceProviders: {} })
	return response.externalInstanceProviders
}

export async function setExternalInstanceProviders (externalInstanceProviders: Record<string, any> = {}) {
	return browser.storage.local.set({
		externalInstanceProviders: externalInstanceProviders,
	})
}

// TODO: Add types
export async function addExternalInstanceProvider (addedExternalInstanceProvider) {
	const providers = await getExternalInstanceProviders()
	if (addedExternalInstanceProvider.id) {
		throw new Error('provided external instance provider with an id to addExternalInstanceProvider.')
	}

	let id
	do {
		id = uuid()
	} while (id in providers)

	const providerWithId = { id: id, ...addedExternalInstanceProvider }
	const newProviders = { [id]: providerWithId, ...providers }

	await setExternalInstanceProviders(newProviders)

	return providerWithId
}
