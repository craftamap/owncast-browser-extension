// tailwind.config.js
module.exports = {
	purge: {
		content: [
			'./src/**/*.hbs',
			'./src/**/*.vue'
		],
		enabled: true,
	},
	darkMode: 'media', // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {},
	plugins: [
		require('@tailwindcss/forms'),
	],
}
