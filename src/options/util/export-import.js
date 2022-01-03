import { Validator } from '@cfworker/json-schema'
import Schema05 from './export-0.5.0.schema.json'

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
function generateExport (state) {
	/** @type {Export} */
	const exportData = {
		version: OWNCAST_BROWSER_EXTENSION_VERSION,
		options: state.options,
		instances: state.instances,
	}
	const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' })
	return blob
}

/**
 * @param {Blob} exportBlob
 */
async function parseExport (exportBlob) {
	if (exportBlob.type !== 'application/json') {
		throw new Error('wrong filetype')
	}
	const exportText = await exportBlob.text()
	/** @type {Export} */
	const potentialExportData = JSON.parse(exportText)

	const validator = new Validator(Schema05)
	const result = validator.validate(potentialExportData)
	if (!result.valid) {
		let errorMsg = 'Error while validating export. The following issues were found:\n'
		for (const error of result.errors) {
			errorMsg += '-' + error.error + '\n'
		}
		throw new Error(errorMsg)
	}

	return potentialExportData
}

export {
	generateExport,
	parseExport,
}
