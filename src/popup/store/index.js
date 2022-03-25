import { defineStore } from 'pinia'
import browser from 'webextension-polyfill'

export const useStore = defineStore('main', {
	state: () => ({
		theme: '',
		layout: '',
		instances: [],
		loading: false,
		add: {
			show: false,
			loading: false,
			success: false,
			error: false,
		},
	}),
	actions: {
		async fetchThemeAndLayout () {
			console.log('fetch')
			const options = await browser.runtime.sendMessage({
				type: 'getSettings',
			})
			this.theme = options.theme
			this.layout = options.layout
		},
		async getInstanceData () {
			const instances = await browser.runtime.sendMessage({
				type: 'getInstanceData',
			})
			this.instances = [...instances]
		},
		setInstances (instances) {
			this.instances = [...instances]
		},
		async updateInstanceData () {
			this.loading = true
			try {
				const instances = await browser.runtime.sendMessage({
					type: 'updateInstanceData',
				})
				this.instances = [...instances]
				this.loading = false
			} catch (e) {
				this.loading = false
			}
		},
		toggleShowAddBar () {
			this.add.show = !this.add.show
		},
		setAddLoading () {
			this.add.loading = true
			this.add.success = false
			this.add.error = false
		},
		setAddSuccess () {
			this.add.loading = false
			this.add.success = true
			this.add.error = false
		},
		setAddError () {
			this.add.loading = false
			this.add.success = false
			this.add.error = true
		},
		unsetAdd () {
			this.add.loading = false
			this.add.success = false
			this.add.error = false
		},
		/**
		 * @param {string} url
		 **/
		async removeInstanceInStorage (url) {
			await browser.runtime.sendMessage({
				type: 'removeInstanceInStorage',
				data: {
					url,
				},
			})
			await this.updateInstanceData()
		},
		/**
		 * @param {string} url
		 **/
		async checkConnectionAndAddInStorage (url) {
			let success = false
			try {
				this.setAddLoading()
				if (url.slice(-1) !== '/') {
					url = url + '/'
				}

				const urlObj = new URL(url)
				if (!(urlObj.protocol === 'http:' || urlObj.protocol === 'https:')) {
					throw new Error('Wrong Protocol!')
				}
				console.log(url)

				await browser.runtime.sendMessage({
					type: 'checkConnection',
					data: {
						url: url,
					},
				})

				console.log('checkConnection was successful, now add Instance')
				await browser.runtime.sendMessage({
					type: 'addInstanceInStorage',
					data: {
						url: url,
					},
				})

				this.setAddSuccess()

				success = true
			} catch (e) {
				this.setAddError()
			}

			await new Promise((resolve) => {
				this.updateInstanceData()
				setTimeout(() => {
					console.log('unset')
					this.unsetAdd()
					if (success) {
						this.toggleShowAddBar()
					}
					resolve()
				}, 3000)
			})
		},

	},
})
