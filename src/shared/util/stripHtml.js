/**
 * Extracts the plain text of a string containing html
 * @param {string} html html to extract text from
 * @returns {string} text without html tags
 */
export default function stripHtml (html) {
	const parser = new DOMParser()
	const doc = parser.parseFromString(html, 'text/html')
	return doc.querySelector('body').innerText
}
