# Firefox Owncast Extension

Firefox Owncast Extension is a Firefox extension used to follow various
Owncast Instances

![Screenshot](.github/screenshot.png)

## Installation

Currently, no signed release of this extension exists. Stay tuned!
If you want to test this extension however, you can download the zip
from the latest GitHub Action Run of master.

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
