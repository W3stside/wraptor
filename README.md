<!-- [![npm version](https://img.shields.io/npm/v/@gnosis.pm/dex-react.svg?style=flat)](https://npmjs.org/package/@gnosis.pm/dex-react 'View this project on npm') -->
<!-- [![Build Status](https://travis-ci.org/gnosis/dex-react.svg?branch=develop)](https://travis-ci.org/gnosis/dex-react) -->
<!-- [![Coverage Status](https://coveralls.io/repos/github/gnosis/dex-react/badge.svg?branch=master)](https://coveralls.io/github/gnosis/dex-react?branch=master) -->

<!-- [![Build Status](https://travis-ci.org/gnosis/dex-react.svg?branch=develop)](https://travis-ci.org/gnosis/dex-react) -->
<!-- [![Coverage Status](https://coveralls.io/repos/github/gnosis/dex-react/badge.svg?branch=develop)](https://coveralls.io/github/gnosis/dex-react?branch=develop) -->

# React 16.8+ (hooks) & Typescript 3.72+ Web App

This app will allow to:

- Do stuff

## Running locally

```bash
# Install dependencies
yarn install

# Start dev server in http://localhost:8080
yarn start
```

Open http://localhost:8080 in any browser.

## Mock mode (default)

The app will run by default in **mock mode**, that means that all service implementations will be replaced by a mocked one with some fake data. This is useful for development, however it's also useful to run it with the actual implementation:

```bash
# Disable mock mode
MOCK=false yarn start
```

Alternatively, if you want to modify always this behaviour, add the env var into a local `.env` file (i.e. use [.env.example](.env.example) as an example of the content).

## Build app

```bash
yarn build
```

The static files will be generated in `./dist` dir.

## Run tests

```bash
yarn test
```

## Automatically fixing code

Manually, by running:

```bash
yarn lint:fix
```

If you use Visual Studio Code, it's recommended to install [Prettier - Code formatter
](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and add the following to your `settings.json`

```json
"eslint.autoFixOnSave":  true,
"eslint.validate":  [
  "javascript",
  "javascriptreact",
  {"language":  "typescript",  "autoFix":  true  },
  {"language":  "typescriptreact",  "autoFix":  true  }
]
```