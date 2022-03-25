import { defineStore } from 'pinia'
import browser from 'webextension-polyfill'
import { generateExport, parseExport } from '../util/export-import'

export const useStore = defineStore('options', {
	state: () => ({
		display: {
			loading: false,
			success: false,
			error: false,
			dirty: false,
			importExportErrors: '',
		},
		options: {
			badge: false,
			notifications: false,
			interval: 0,
			username: '',
			theme: '',
			layout: '',
		},
		instances: [],
	}),
	actions: {
		setDisplayLoading () {
			this.display.loading = true
			this.display.success = false
			this.display.error = false
		},
		setDisplaySuccess () {
			this.display.loading = false
			this.display.success = true
			this.display.error = false
		},
		setDisplayError () {
			this.display.loading = false
			this.display.success = false
			this.display.error = true
		},
		unsetDisplay () {
			this.display.loading = false
			this.display.success = false
			this.display.error = false
		},
		setDirty (dirtyness) {
			this.display.dirty = dirtyness
		},
		setImportExportErrors (errors) {
			this.display.importExportErrors = errors
		},
		setOptions (options) {
			this.options = options
			console.log('[setOptions]', this.options)
		},
		/** @param {Array<string>} instances */
		setInstances (instances) {
			this.instances = instances
			console.log('[setInstances]', this.instances)
		},
		/** @param {boolean} badge */
		setBadge (badge) {
			this.options.badge = badge
		},
		/** @param {boolean} notifications */
		setNotifications (notifications) {
			this.options.notifications = notifications
		},
		/** @param {number} interval */
		setInterval (interval) {
			this.options.interval = interval
		},
		/** @param {string} username */
		setUsername (username) {
			this.options.username = username
		},
		setTheme (theme) {
			this.options.theme = theme
		},
		setLayout (layout) {
			this.options.layout = layout
		},
		async getOptionsFromStorage () {
			return browser.runtime.sendMessage({
				type: 'getSettings',
			}).then((options) => {
				console.log('[getOptionsFromStorage]', options)
				this.setOptions(options)
			})
		},
		async getInstancesFromStorage () {
			return browser.runtime.sendMessage({
				type: 'getInstances',
			}).then((instances) => {
				console.log('[getInstancesFromStorage]', instances)
				this.setInstances(instances.instances)
			})
		},
		async storeOptionsInStorage () {
			// Although not mutating, we should propably move this sendMessage to an
			// vuex action as well
			console.log('[store]', this.options)
			this.setDisplayLoading()
			return browser.runtime.sendMessage({
				type: 'storeSettings',
				data: {
					options: { ...this.options },
				},
			}).then(() => {
				return this.getOptionsFromStorage()
			}).then(() => {
				return this.setDisplaySuccess()
			}).then(() => {
				return this.setDirty(false)
			}).catch(() => {
				return this.setDisplayError()
			}).then(() => {
				return new Promise(() => {
					setTimeout(() => {
						this.unsetDisplay()
					}, 3000)
				})
			})
		},
		async generateExport () {
			return Promise.all([this.getInstancesFromStorage(), this.getOptionsFromStorage()]).then(() => {
				const exportDataBlob = generateExport(this)
				const url = URL.createObjectURL(exportDataBlob)
				const link = document.createElement('a')
				const date = new Date()
				link.download = `owncast-browser-extension-export-${date.toISOString().replaceAll(':', '-')}.json`
				link.href = url
				link.click()
				URL.revokeObjectURL(link.href)
				document.removeChild(link)

				window.open(url, '_blank')
			})
		},
		/**
		 * @param {File} file
		 */
		async triggerImport (file) {
			this.setImportExportErrors('')
			try {
				const parsedExport = await parseExport(file)
				// for now, let's assume a export only contains existing owncast instances.
				parsedExport.instances.forEach((instance) => {
					browser.runtime.sendMessage({
						type: 'addInstanceInStorage',
						data: {
							url: instance,
						},
					})
				})
				// Let's merge current setting with the imported ones
				this.setOptions({ ...this.options, ...parsedExport.options })
				this.storeOptionsInStorage()
			} catch (e) {
				this.setImportExportErrors(e)
			}
		},
	},
})
