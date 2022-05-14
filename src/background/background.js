import browser from 'webextension-polyfill'
import api from './api/owncast'
import * as Storage from './util/storage.ts'
import stripHtml from '../shared/util/stripHtml'
import urlcat from 'urlcat'
import { createMastodonApp, obtainMastodonOAuthToken, verifyCredentials } from './api/mastodon'

/**
 * @param {Date} timestamp
 */
function dateDiff (timestamp, structure = dateDiff.structure) {
	let delta = Math.abs(timestamp.getTime() - new Date().getTime()) / 1000
	const res = {}

	for (const key in structure) {
		res[key] = Math.floor(delta / structure[key])
		delta -= res[key] * structure[key]
	}

	return res
}

dateDiff.structure = {
	hour: 3600,
	minute: 60,
	second: 1,
}

const refreshInstanceData = async () => {
	const instances = await Storage.getInstancesFromStorage()
	const statuses = await Promise.allSettled(instances.instances.map(async (instance) => {
		const cast = new api.OwnCast(instance)
		const status = await cast.getStatus()
		const config = await cast.getConfig()

		const logoIsAbsolute = (/^https?:\/\//i).test(config.logo)

		return {
			name: config.name,
			streamTitle: status && status.streamTitle,
			description: config.summary.length > 61
				? config.summary.substring(0, 61) + '...'
				: config.summary,
			viewer: status.viewerCount,
			status: status.online ? 'online' : 'offline',
			online: status.online,
			lastConnectTime: status.lastConnectTime,
			onlineSince: dateDiff(new Date(status.lastConnectTime)),
			thumbnail: instance + 'thumbnail.jpg',
			logo: logoIsAbsolute ? config.logo : urlcat(instance, config.logo),
			instance,
		}
	}))
	console.log('[refreshInstanceData]', statuses)
	const newInstanceData = statuses
		.filter((a) => a.status === 'fulfilled')
		.map((/** @type {PromiseFulfilledResult} */ a) => a.value)
		.sort((a, b) => b.online - a.online)
	const oldData = [...globalThis.bgApp.instanceData || []]

	await sendNotifications(oldData || [], newInstanceData)

	globalThis.bgApp.instanceData = newInstanceData

	await setBadge(globalThis.bgApp.instanceData)

	return newInstanceData
}

const sendNotifications = async (oldData, newData) => {
	const options = await Storage.getOptionsFromStorage()
	if (options.notifications) {
		const oldUrls = new Set(oldData.filter((a) => { return a.online }).map(x => x.instance))
		const newInstances = {}
		const newDiff = []
		for (const instance of newData.filter((a) => { return a.online })) {
			newInstances[instance.instance] = instance
		}
		for (const instanceUrl of Object.keys(newInstances)) {
			if (!oldUrls.has(instanceUrl)) {
				newDiff.push(newInstances[instanceUrl])
			}
		}

		newDiff.forEach((item) => {
			browser.notifications.create({
				type: 'basic',
				title: item.name + ' is online',
				message: stripHtml(item.streamTitle) || stripHtml(item.description),
				iconUrl: item.logo,
			})
		})

		console.log('[sendNotifications]', newInstances)
	}
}

const setBadge = async (instanceData) => {
	const options = await Storage.getOptionsFromStorage()
	if (options.badge) {
		const online = instanceData.filter((a) => { return a.online })
		if (online.length > 0) {
			await browser.browserAction.setBadgeBackgroundColor({ color: '#3d007a' })
			await browser.browserAction.setBadgeText({ text: `${online.length}` })
		} else {
			// hide the badge if no followed instances are online
			await browser.browserAction.setBadgeText({ text: '' })
		}
	} else {
		await browser.browserAction.setBadgeText({ text: '' })
	}
}

const onMessageListener = (/** @type {{type: string, data: any}} */ request, sender) => {
	/** @typedef {typeof request} r
	    @type {Record<string, ((request: r, sender?: any) => Promise<any>)>} */
	const listener = {
		checkConnection (request, sender) {
			console.log('[checkConnection]', request.data.url)
			const cast = new api.OwnCast(request.data.url)
			return cast.getConfig()
		},
		getInstanceData (request, sender) {
			return Promise.resolve(globalThis.bgApp.instanceData || [])
		},
		updateInstanceData (request, sender) {
			console.log('[updateInstanceData] before')
			return refreshInstanceData()
		},
		removeInstanceInStorage (request, sender) {
			return Storage.removeInstanceInStorage(request.data.url)
		},
		addInstanceInStorage (request, sender) {
			return Storage.addInstanceInStorage(request.data.url)
		},
		followButtonGetStatus (request, sender) {
			const url = request.data.url
			return Storage.getInstancesFromStorage().then((res) => {
				const instances = res.instances
				const incl = instances.includes(url)
				return incl
			})
		},
		async followButtonFollow (request, sender) {
			console.log('[followButtonFollow]', request.data.url)
			const cast = new api.OwnCast(request.data.url)
			return cast.getConfig().then(() => {
				return Storage.addInstanceInStorage(request.data.url)
			}).then(refreshInstanceData)
				.then(() => 'success')
		},
		async followButtonUnfollow (request, sender) {
			console.log('[followButtonFollow]', request.data.url)
			return Storage.removeInstanceInStorage(request.data.url)
				.then(refreshInstanceData)
				.catch(console.log)
				.then(() => 'success')
		},
		getSettings (request) {
			console.log('[getSettings]')
			return Storage.getOptionsFromStorage()
		},
		getInstances (request) {
			console.log('[getInstances]')
			return Storage.getInstancesFromStorage()
		},
		storeSettings (request) {
			console.log('[storeSettings]')
			console.log('[storeSettings]', request.data.options)
			return Storage.setOptionsInStorage(request.data.options)
		},
		getStoredUsername (request) {
			console.log('[getStoredUsername]')
			return Storage.getOptionsFromStorage().then((options) => {
				return options.username
			})
		},
		createMastodonApp (request) {
			const mastodonInstanceUrl = request.data.mastodonInstanceUrl
			const redirectUrl = browser.identity.getRedirectURL()
			console.log(redirectUrl)

			return createMastodonApp(mastodonInstanceUrl, redirectUrl)
		},
		obtainMastodonOAuthToken (request) {
			const { mastodonInstanceUrl, details } = request.data
			return obtainMastodonOAuthToken(mastodonInstanceUrl, details)
		},
		async getExternalInstanceProviders (request) {
			return { externalInstanceProviders: await Storage.getExternalInstanceProviders() }
		},
		addExternalInstanceProvider (request) {
			const instanceProvider = request.data.instanceProvider
			return Storage.addExternalInstanceProvider(instanceProvider)
		},
		verifyMastodonCredentials (request) {
			return verifyCredentials(request.data.mastodonInstanceUrl, request.data.bearerToken)
		},
	}
	const requestType = request && request.type
	return listener[requestType](request, sender)
}

window.addEventListener('load', function (event) {
	globalThis.bgApp = {
		instanceData: [],
	}

	browser.runtime.onMessage.addListener(onMessageListener)

	const recursiveRefresh = () => {
		refreshInstanceData().then((data) => {
			return browser.runtime.sendMessage({
				type: 'updatedInstanceData',
				data: {
					instances: data,
				},
			})
		}).catch((reason) => {
			console.warn(reason)
		}).then(() => {
			return Storage.getOptionsFromStorage()
		}).then((options) => {
			const interval = options.interval * 1000
			console.log(`[refreshInstanceData] done! Next exec in ${interval} ms`)
			setTimeout(recursiveRefresh, interval)
		})
	}
	recursiveRefresh()
})
