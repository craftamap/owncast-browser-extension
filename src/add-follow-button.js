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
		button.addEventListener('click', () => {
			button.textContent = 'Wait...';
			browser.runtime.sendMessage({
				type: 'follow',
				data: {
					url: window.location.href
				},
			}).then((response) => {
				console.log(response);
				button.textContent = 'Done!';
				setTimeout(() => {
					button.remove();
					waitForSocialList();
				}, 3000)
			}, console.trace);
		});
		socialList.append(button);
	} else {
		const button = htmlToElement('<button class="ml-2 border-2 rounded border-red-700 p-2">Remove From Extension</button>');
		button.addEventListener('click', () => {
			button.textContent = 'Wait...';
			browser.runtime.sendMessage({
				type: 'unfollow',
				data: {
					url: window.location.href
				},
			}).then((response) => {
				console.log(response);
				button.textContent = 'Done!';
				setTimeout(() => {
					button.remove();
					waitForSocialList();
				}, 3000)
			});
		});
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
		console.log('found video container');
		waitForSocialList();

	}
	timeouts.threehundered = setTimeout(onTimeout, 300);
	timeouts.thousendfivehundered = setTimeout(onTimeout, 1500);
}

init();
