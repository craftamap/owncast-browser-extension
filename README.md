# Owncast Browser Extension 

![release](https://img.shields.io/github/v/release/craftamap/owncast-browser-extension?style=flat-square) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/craftamap/owncast-browser-extension/build?style=flat-square)

![Screenshot](meta/screenshot-chrome.png)

Owncast Browser Extension is a Firefox and Chrome/Chromium extension used to 
follow various Owncast Instances


## Installation

The addon can be installed from [addons.mozilla.com](https://addons.mozilla.org/en-US/firefox/addon/owncast-extension/) or from the [Chrome Web Store](https://chrome.google.com/webstore/detail/owncast-extension/djgneammmklaajinkihpibdpaflehgio?hl=de).

## Building and Development

This extension uses `webpack` as build system. For most components, [Vue.js](https://vuejs.org/)
and [Vuex](https://vuex.vuejs.org/) is used. Sometimes, vanillajs is used though.

[tailwindcss](https://tailwindcss.com/) is also used.

This Extension is built using `yarn`. You may also use `npm`, but `yarn` is 
recommended. You can use the following commands:

- `yarn build` - Runs `webpack` and `web-ext build`.
  This is used to build the plugin. Use yarn `yarn install` 
  first. The extension will be outputted into web-ext-artifacts directory.
- `yarn lint` - Runs `eslint` and `web-ext lint`
- `yarn watch` - Runs `webpack --watch`
- `yarn start` - Runs `web-ext start`. Use together with `yarn watch` to see
  your changes in live-time.

## Contributing

Pull requests are welcome.

## License

[MIT](https://choosealicense.com/licenses/mit/)
