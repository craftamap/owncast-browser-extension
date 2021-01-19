import browser from 'webextension-polyfill';

function htmlToElement(html) {
	const template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}
function foundSocialList(response, socialList) {
	console.log(socialList)
	if (!response) {
		const button = htmlToElement('<button class="ml-2 border-2 rounded border-blue-500 p-2">Add To Extension</button>');
		const onClick = () => {
			button.removeEventListener('click', onClick);
			button.textContent = 'Wait...';
			browser.runtime.sendMessage({
				type: 'follow',
				data: {
					url: window.location.href
				},
			}).then((response) => {
				console.log(response);
				return button.textContent = 'Done!';
			}).catch((reason) => {
				console.error('[foundSocialList]', reason);
				return button.textContent = 'Failed...';
			}).then(() => {
				setTimeout(() => {
					button.remove();
					waitForSocialList();
				}, 3000)
			}, console.trace);
		};
		button.addEventListener('click', onClick);
		socialList.append(button);
	} else {
		const button = htmlToElement('<button class="ml-2 border-2 rounded border-red-700 p-2">Remove From Extension</button>');
		const onClick = () => {
			button.removeEventListener('click', onClick);
			button.textContent = 'Wait...';
			browser.runtime.sendMessage({
				type: 'unfollow',
				data: {
					url: window.location.href
				},
			}).then((response) => {
				console.log(response);
				return button.textContent = 'Done!';
			}).catch((reason) => {
				console.error('[foundSocialList]', reason);
				return button.textContent = 'Failed...';
			}).then(() => {
				setTimeout(() => {
					button.remove();
					waitForSocialList();
				}, 3000)
			}, console.trace);
		};
		button.addEventListener('click', onClick);
		socialList.append(button);

	}
}

function waitForSocialList() {
	let socialList = document.getElementById('social-list');
	if (socialList === null) {
		setTimeout(waitForSocialList, 100);
	} else {
		console.log('trying to send message');
		browser.runtime.sendMessage({
			type: 'getStatus',
			data: {
				url: window.location.href
			},
		}).then((response) => {
			console.log('got response', response);
			console.log(socialList);
			foundSocialList(response, socialList);
		});
	}
}

function autoChangeUsername() {
	console.log('[autoChangeUsername]')
	browser.runtime.sendMessage({
		type: 'getStoredUsername'
	}).then((response) => {
		console.log('[autoChangeUsername] got response', response);
		const username = response;
		if (username) {
			console.log('[autoChangeUsername] got valid username')
			
			const usernameAlreadyStored = localStorage.getItem('owncast_username')
			if (usernameAlreadyStored) {
				console.log('[autoChangeUsername] found username', usernameAlreadyStored, 'associated with this instance - not changing username automatically')
				return;
			}

			const userInfoChange = document.querySelector('#user-info-change');
			const usernameUpdateInput = userInfoChange.querySelector('#username-change-input')
			const usernameUpdateButton = userInfoChange.querySelector('#button-update-username')

			if (usernameUpdateInput.value === username) {
				console.log('[autoChangeUsername] username already', usernameUpdateInput.value, 'not changing')
			} else {
				console.log('[autoChangeUsername] changing username to', username)
				usernameUpdateInput.value = username;
				usernameUpdateButton.click();
				console.log('[autoChangeUsername] done!')
			}
		} else {
			console.log('[autoChangeUsername] no or invalid username found in storage. Bummer.')
		}
	})
}

function init() {
	if (window.addFollowButton) {
		return;
	}
	window.addFollowButton = true;
	// If a webpage has an owncast-video-container, its propably an owncast instance
	const timeouts = {};
	const onTimeout = () => {
		console.log('check for owncast video container');
		if (document.getElementsByClassName('owncast-video-container').length < 1) {
			console.log('no video container');
			return;
		}
		clearTimeout(timeouts.thousendfivehundered);
		clearTimeout(timeouts.threethousand);
		console.log('found video container');
		waitForSocialList();
		autoChangeUsername();
	}
	timeouts.threehundered = setTimeout(onTimeout, 300);
	timeouts.thousendfivehundered = setTimeout(onTimeout, 1500);
	timeouts.threethousand = setTimeout(onTimeout, 3000);
}

init();
