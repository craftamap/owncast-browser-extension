function init() {
	/**
	 * @param {String} HTML representing a single element
	 * @return {Element}
	 */
	function htmlToElement(html) {
		const template = document.createElement('template');
		html = html.trim(); // Never return a text node of whitespace as the result
		template.innerHTML = html;
		return template.content.firstChild;
	}


	if (window.addFollowButton) {
		//return;
	}
	//window.addFollowButton = true;
	console.log('a');
	// If a webpage has an owncast-video-container, its propably an owncast instance
	if (document.getElementsByClassName('owncast-video-container').length < 1) {
		return;
	}
	const socialList = document.getElementById('social-list');
	const button = htmlToElement('<button class="border-2 rounded border-blue-500 p-2">Add to Extension</button>');
	button.addEventListener('click', () => {
		button.textContent = 'Wait...';
		browser.runtime.sendMessage(JSON.stringify({
			type: 'follow',
			data: {
				url: window.location.href
			},
		})).then((response) => {
			button.textContent = 'Done!';
		}, console.log);
	});
	socialList.append(button);
}

init();
