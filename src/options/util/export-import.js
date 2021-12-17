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
 * @returns {Blob}
 */
function generateExport(state) {
	/** @type {Export} */
	const exportData = {
		version: OWNCAST_BROWSER_EXTENSION,
		options: state.options,
		instances: state.instances,
	}
	const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' })
	return blob
}

/**
 * @param {Blob} exportBlob
 */
async function parseExport(exportBlob) {
	if (exportBlob.type !== 'application/json') {
		throw new Error('wrong filetype')
	}
	const exportText = await exportBlob.text()
	/** @type {Export} */
	const potentialExportData = JSON.parse(exportText)

	/** @type {Export} */
	const returnedExportData = {
		options: {},
		instances: [],
	}
	// TODO: check version!
	// only copy values if they are of the correct data type
	// TODO: check if we have further limits
	// TODO: could we somehow automate this?
	if (potentialExportData.options) {
		if (typeof potentialExportData.options.badge === 'boolean') {
			returnedExportData.options.badge = potentialExportData.options.badge
		}
		if (typeof potentialExportData.options.interval === 'number') {
			returnedExportData.options.interval = potentialExportData.options.interval
		}
		if (typeof potentialExportData.options.notifications === 'boolean') {
			returnedExportData.options.notifications = potentialExportData.options.notifications
		}
		if (typeof potentialExportData.options.username === 'string') {
			returnedExportData.options.username = potentialExportData.options.username
		}
	}
	if (Array.isArray(potentialExportData.instances)) {
		for (const potentialInstance of potentialExportData.instances) {
			const urlObj = new URL(potentialInstance)
			if (!(urlObj.protocol === 'http:' || urlObj.protocol === 'https:')) {
				throw new Error('Wrong Protocol!')
			}
			returnedExportData.instances.push(potentialInstance)
		}
	}

	return returnedExportData
}

export {
	generateExport,
	parseExport,
}
