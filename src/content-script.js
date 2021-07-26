import browser from 'webextension-polyfill';

function htmlToElement(html) {
	const template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}
function foundSocialList(response, container) {
	const potentialSocial = container.querySelector('#social-list li:last-child')
	let buttonContainer;
	if (potentialSocial !== null) {
		buttonContainer = potentialSocial;
	} else {
		buttonContainer = container.querySelector('h2');
	}
	if (!response) {
		const button = htmlToElement('<button class="ml-2 border-2 rounded border-blue-500 p-2">Add To Extension</button>');
		const onClick = () => {
			button.removeEventListener('click', onClick);
			button.textContent = 'Wait...';
			browser.runtime.sendMessage({
				type: 'followButtonFollow',
				data: {
					url: window.location.href
				},
			}).then((response) => {
				process.env.NODE_ENV === 'development' && console.log(response);
				return button.textContent = 'Done!';
			}).catch((reason) => {
				process.env.NODE_ENV === 'development' && console.error('[foundSocialList]', reason);
				return button.textContent = 'Failed...';
			}).then(() => {
				setTimeout(() => {
					button.remove();
					waitForContainer();
				}, 3000)
			}, (error) => {
				process.env.NODE_ENV === 'development'  && console.trace(error);
			});
		};
		button.addEventListener('click', onClick);
		buttonContainer.after(button);
	} else {
		const button = htmlToElement('<button class="ml-2 border-2 rounded border-red-700 p-2">Remove From Extension</button>');
		const onClick = () => {
			button.removeEventListener('click', onClick);
			button.textContent = 'Wait...';
			browser.runtime.sendMessage({
				type: 'followButtonUnfollow',
				data: {
					url: window.location.href
				},
			}).then((response) => {
				process.env.NODE_ENV === 'development' && console.log(response);
				return button.textContent = 'Done!';
			}).catch((reason) => {
				process.env.NODE_ENV === 'development' && console.error('[foundSocialList]', reason);
				return button.textContent = 'Failed...';
			}).then(() => {
				setTimeout(() => {
					button.remove();
					waitForContainer();
				}, 3000)
			}, console.trace);
		};
		button.addEventListener('click', onClick);
		buttonContainer.after(button);

	}
}

function waitForContainer() {
	let container = document.querySelector('.user-content');
	if (container === null) {
		setTimeout(waitForContainer, 100);
	} else {
		process.env.NODE_ENV === 'development' && console.log('trying to send message');
		browser.runtime.sendMessage({
			type: 'followButtonGetStatus',
			data: {
				url: window.location.href
			},
		}).then((response) => {
			process.env.NODE_ENV === 'development' && console.log('got response', response);
			process.env.NODE_ENV === 'development' && console.log(container);
			foundSocialList(response, container);
		});
	}
}

function autoChangeUsername() {
	process.env.NODE_ENV === 'development' && console.log('[autoChangeUsername]')
	browser.runtime.sendMessage({
		type: 'getStoredUsername'
	}).then((response) => {
		process.env.NODE_ENV === 'development' && console.log('[autoChangeUsername] got response', response);
		const username = response;
		if (username) {
			process.env.NODE_ENV === 'development' && console.log('[autoChangeUsername] got valid username')
			
			const isCustomUsernameSet = localStorage.getItem('owncast_custom_username_set')
			const potentialUsername = localStorage.getItem('owncast_username')
			if (isCustomUsernameSet === 'true') {
				process.env.NODE_ENV === 'development' && console.log('[autoChangeUsername] found username', potentialUsername, 'associated with this instance - not changing username automatically')
				return;
			}

			const userInfoChange = document.querySelector('#user-info-change');
			const usernameUpdateInput = userInfoChange.querySelector('#username-change-input')
			const usernameUpdateButton = userInfoChange.querySelector('#button-update-username')

			if (usernameUpdateInput.value === username) {
				process.env.NODE_ENV === 'development' && console.log('[autoChangeUsername] username already', usernameUpdateInput.value, 'not changing')
			} else {
				process.env.NODE_ENV === 'development' && console.log('[autoChangeUsername] changing username to', username)
				usernameUpdateInput.value = username;
				usernameUpdateButton.click();
				process.env.NODE_ENV === 'development' && console.log('[autoChangeUsername] done!')
			}
		} else {
			process.env.NODE_ENV === 'development' && console.log('[autoChangeUsername] no or invalid username found in storage. Bummer.')
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
		process.env.NODE_ENV === 'development' && console.log('check for owncast video container');
		if (document.getElementsByClassName('owncast-video-container').length < 1) {
			process.env.NODE_ENV === 'development' && console.log('no video container');
			return;
		}
		clearTimeout(timeouts.thousendfivehundered);
		clearTimeout(timeouts.threethousand);
		process.env.NODE_ENV === 'development' && console.log('found video container');
		waitForContainer();
		autoChangeUsername();
	}
	timeouts.threehundered = setTimeout(onTimeout, 300);
	timeouts.thousendfivehundered = setTimeout(onTimeout, 1500);
	timeouts.threethousand = setTimeout(onTimeout, 3000);
}

init();
