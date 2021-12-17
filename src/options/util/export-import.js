/**
 * @typedef {import('../store/index.js').Options} Options
 * @typedef {import('../store/index.js').State} State
 *
 * @typedef Export
 * @type {object}
 * @prop {string} version The version of the browser extension
 * @prop {Options} options the user options (like username, theme...)
 * @prop {Array<string>} instances the users instances
 */

/**
 * @param {State} state
 * @returns {Export}
 */
function generateExport (state) {
	return {
		version: OWNCAST_BROWSER_EXTENSION,
		options: state.options,
		instances: state.instances,
	}
}

export {
	generateExport,
}
