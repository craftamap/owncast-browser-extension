import { defineStore } from 'pinia'
import browser from 'webextension-polyfill'
import urlcat from 'urlcat'

export const useStore = defineStore('externalInstanceProviders', {
	state: () => ({
		externalInstanceProviders: {},
	}),
	actions: {
		async getExternalInstanceProviders () {
			const response = await browser.runtime.sendMessage({
				type: 'getExternalInstanceProviders',
			})
			this.externalInstanceProviders = response.externalInstanceProviders
		},
		async addMastodonInstanceProvider (mastodonInstanceUrl) {
			// This creates a mastodon app on the specified instance
			const mastodonAppDetails = await browser.runtime.sendMessage({
				type: 'createMastodonApp',
				data: {
					mastodonInstanceUrl,
				},
			})

			// Using the created instance, we can launch an OAuth flow.
			// This opens a popup that allows the user to log into the provided mastodon instance.
			// We get back an url that contains the authorizationCode
			const authFlowResponseUrl = await browser.identity.launchWebAuthFlow({
				url: urlcat(mastodonInstanceUrl, '/oauth/authorize', {
					response_type: 'code',
					client_id: mastodonAppDetails.client_id,
					redirect_uri: mastodonAppDetails.redirect_uri,
				}),
				interactive: true,
			})

			// Let's parse the authorizationCode
			const parsedResponseUrl = new URL(authFlowResponseUrl)
			const flowResponseParams = parsedResponseUrl.searchParams
			const authorizationCode = flowResponseParams.get('code')
			console.log(authorizationCode)

			// This exchanges the authorizationCode to an bearerToken
			const bearerToken = await browser.runtime.sendMessage({
				type: 'obtainMastodonOAuthToken',
				data: {
					mastodonInstanceUrl: mastodonInstanceUrl,
					details: {
						clientId: mastodonAppDetails.client_id,
						clientSecret: mastodonAppDetails.client_secret,
						redirectUri: mastodonAppDetails.redirect_uri,
						code: authorizationCode,
					},
				},
			})

			console.log(bearerToken)
			// Verify that the credentials we recieved are actually valid
			const userData = await browser.runtime.sendMessage({
				type: 'verifyMastodonCredentials',
				data: {
					mastodonInstanceUrl: mastodonInstanceUrl,
					bearerToken: bearerToken.access_token,
				},
			})

			console.log(userData)
			// store the externalInstanceProvider.
			await browser.runtime.sendMessage({
				type: 'addExternalInstanceProvider',
				data: {
					instanceProvider: {
						type: 'mastodon',
						instanceUrl: mastodonInstanceUrl,
						app: {
							id: mastodonAppDetails.id,
							redirectUri: mastodonAppDetails.redirect_iri,
							clientId: mastodonAppDetails.client_id,
							clientSecret: mastodonAppDetails.client_secret,
						},
						authorizationCode: authorizationCode,
						userData: {
							username: userData.username,
						},
					},
				},
			})

			this.getExternalInstanceProviders()
		},
		async sync (id) {

		},
	},
})
