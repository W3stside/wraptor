<!-- [![npm version](https://img.shields.io/npm/v/@gnosis.pm/dex-react.svg?style=flat)](https://npmjs.org/package/@gnosis.pm/dex-react 'View this project on npm') -->
<!-- [![Build Status](https://travis-ci.org/gnosis/dex-react.svg?branch=develop)](https://travis-ci.org/gnosis/dex-react) -->
<!-- [![Coverage Status](https://coveralls.io/repos/github/gnosis/dex-react/badge.svg?branch=master)](https://coveralls.io/github/gnosis/dex-react?branch=master) -->

<!-- [![Build Status](https://travis-ci.org/gnosis/dex-react.svg?branch=develop)](https://travis-ci.org/gnosis/dex-react) -->
<!-- [![Coverage Status](https://coveralls.io/repos/github/gnosis/dex-react/badge.svg?branch=develop)](https://coveralls.io/github/gnosis/dex-react?branch=develop) -->

# 🦖 WRAPTOR - Ether > WETH Wrapper
#### Built on React 16.8+ (hooks) & Typescript 3.72+

Handles wrapping Ether to Wrapped Ether (WETH) via `useWraptor` hook and/or the `WraptorComponent`

## Using
1. Hook:

#### Type: 'ETH' | undefined
```ts
// ETH > WETH Wrapping hook
useWraptor(type?: 'ETH', {
    provider,
    contractAddress,
    userAddress,
  })

// NOTE: leaving out type (i.e undefined) is an alias

/** Returns WETH wrapper API:

* interface Wraptor {
*   userBalanceWei: string
*   userAllowanceWei: string
*   getBalance: () => Promise<void>
*   getAllowance: () => Promise<void>
*   approve: ({ spenderAddress, amount }: { spenderAddress?: string; amount: string }) => Promise<TransactionReceipt>
*   wrap: ({ amount }: { amount: string }) => Promise<TransactionReceipt>
* }

**/
```

#### Type: 'TOKEN'
```ts
// mini Token API hook
useWraptor(type: 'TOKEN', {
    provider,
    contractAddress,
    userAddress,
  })

/** Returns Token API:

* interface TokenWraptor {
*   userBalanceWei: string
*   userAllowanceWei: string
*   getBalance: () => Promise<void>
*   getAllowance: () => Promise<void>
*   approve: ({ spenderAddress, amount }: { spenderAddress?: string; amount: string }) => Promise<TransactionReceipt>
* }

**/

// NOTE: Cannot wrap with this API - just approve and get constants
```

2. Component
```ts
...
import WraptorComponent from 'components/WraptorComponent'
import { FlexColumnContainer } from 'components/styled'

import useWindowLoaded from 'hooks/useWindowLoaded'

import { RINKEBY_GNO, USER_ADDRESS, RINKEBY_WETH, INITIAL_INFURA_ENDPOINT } from 'const'

const provider = new Web3(window?.web3?.currentProvider || INITIAL_INFURA_ENDPOINT)

// App
const App: React.FC = () => {
  const web3Loaded = useWindowLoaded()
  return web3Loaded ? (
    <>
      <GlobalStyles />
      <h3>WRAPTOR</h3>
      <FlexColumnContainer width="900px">
        <h5>Token Wraptor:</h5>
        <WraptorComponent type="TOKEN" contractAddress={RINKEBY_GNO} provider={provider} userAddress={USER_ADDRESS} />
        <h5>ETH Wraptor:</h5>
        <WraptorComponent type="ETH" contractAddress={RINKEBY_WETH} provider={provider} userAddress={USER_ADDRESS} />
      </FlexColumnContainer>
    </>
  ) : null
}
...
```

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