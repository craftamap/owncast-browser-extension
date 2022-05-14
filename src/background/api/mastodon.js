import urlcat from 'urlcat'

/**
 * @param {string} redirectUri
 * @param {string} mastodonInstanceUrl
 * @returns {Promise<{id: string, name: string, website: string?, redirect_uri: string?, client_id: string, client_secret: string, vapid_key: string}>}
 */
export async function createMastodonApp (mastodonInstanceUrl, redirectUri) {
	const url = urlcat(mastodonInstanceUrl, '/api/v1/apps')
	const formData = new FormData()
	formData.append('client_name', 'Owncast Browser Extension')
	formData.append('redirect_uris', redirectUri)
	// formData.append('scopes', '') // TODO
	// formData.append('website', '') // TODO

	const response = await fetch(url, {
		method: 'POST',
		body: formData,
	})
	if (!response.ok) {
		throw new Error(`error while creating mastodon app; status=${response.status} body=${await response.text()}`)
	}
	return response.json()
}

export async function obtainMastodonOAuthToken (mastodonInstanceUrl, { clientId, clientSecret, redirectUri, code }) {
	const url = urlcat(mastodonInstanceUrl, '/oauth/token')
	const formData = new FormData()
	formData.append('grant_type', 'authorization_code')
	formData.append('redirect_uri', redirectUri)
	formData.append('client_id', clientId)
	formData.append('client_secret', clientSecret)
	// formData.append('scopes', '') // TODO
	formData.append('code', code)

	const response = await fetch(url, {
		method: 'POST',
		body: formData,
	})
	if (!response.ok) {
		throw new Error(`error while obtaining oauth token; status=${response.status} body=${await response.text()}`)
	}
	return response.json()
}

export async function verifyCredentials (mastodonInstanceUrl, bearerToken) {
	const url = urlcat(mastodonInstanceUrl, '/api/v1/accounts/verify_credentials')

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${bearerToken}`,
		},
	})
	if (!response.ok) {
		throw new Error(`error while verifying credentials; status=${response.status} body=${await response.text()}`)
	}
	return response.json()
}

export async function getFollowing (mastodonInstanceUrl, bearerToken, { page = 0, pageSize = 20 }) {
	const verifyUrl = urlcat(mastodonInstanceUrl, '/api/v1/accounts/verify_credentials')

	const verifyResponse = await fetch(verifyUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${bearerToken}`,
		},
	})
	if (!verifyResponse.ok) {
		throw new Error(`error while getting user information in getFollowing; status=${verifyResponse.status} body=${await verifyResponse.text()}`)
	}
	const accountInformation = await verifyResponse.json()

	const url = urlcat(mastodonInstanceUrl, '/api/v1/accounts/:userId/following', { userId: accountInformation.id })
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${bearerToken}`,
		},
	})
	if (!response.ok) {
		throw new Error(`error while getting user information in getFollowing; status=${verifyResponse.status} body=${await verifyResponse.text()}`)
	}
}
