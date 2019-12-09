# 🦖 WRAPTOR 🦖 
## Ether <-> WETH Wrapper and Unwrapper
##### Built on React 16.8+ (hooks) & Typescript 3.72+

Handles wrapping Ether to Wrapped Ether (WETH) via `useWraptor` hook and/or the `WraptorComponent`

## Using useWraptor Hook

#### Type: 'ETH' | undefined
```ts
/**
 * ETH <-> WETH Wrapping hook
 * */

// Hook parameters:
interface WraptorParams {
  provider?: Web3
  contractAddress?: string
  userAddress?: string
  catalyst?: string | boolean | number
}

function useWraptor({
    provider,
    contractAddress,
    userAddress,
    catalyst,
  }: WraptorParams, type?: 'ETH'): EthWraptor {} // NOTE: leaving out type (i.e undefined) is an alias

// Returned interface:
interface EthWraptor {
  contract?: Contract
  tokenDisplay: { name?: string; symbol?: string; decimals?: string }
  userBalanceWei: string
  userAllowanceWei: string
  getBalance: () => Promise<void>
  getAllowance: () => Promise<void>
  getTokenDisplay: () => Promise<void>
  approve: ({ spenderAddress, amount }: { spenderAddress?: string; amount: string }) => Promise<TransactionReceipt>
  wrap: ({ amount }: { amount: string }) => Promise<TransactionReceipt>
  unwrap: ({ amount }: { amount: string }) => Promise<TransactionReceipt>
}

```

#### Type: 'TOKEN'
```ts
// Hook parameters:
interface WraptorParams {
  provider?: Web3 | { eth: ETH }
  contractAddress?: string
  userAddress?: string
  catalyst?: string | boolean | number
}

function useWraptor({
    provider,
    contractAddress,
    userAddress,
    catalyst,
  }: WraptorParams, type: 'TOKEN'): Wraptor {}

// Returns Token API:
interface Wraptor {
  contract?: Contract
  tokenDisplay: { name?: string; symbol?: string; decimals?: string }
  userBalanceWei: string
  userAllowanceWei: string
  getBalance: () => Promise<void>
  getAllowance: () => Promise<void>
  getTokenDisplay: () => Promise<void>
  approve: ({ spenderAddress, amount }: { spenderAddress?: string; amount: string }) => Promise<TransactionReceipt>
}

// NOTE: Cannot wrap with this API - just approve and get constants
```

## Using WraptorComponent
```ts
const provider = new Web3(window?.web3?.currentProvider || INITIAL_INFURA_ENDPOINT)

interface WraptorComponentProps {
  type: 'ETH' | 'TOKEN'
  provider: Web3
  contractAddress: string
  userAddress: string
  catalyst?: string | number | boolean
  // style
  customStyle?: CSSObject
  buttonLabels?: {
    showAllowance: string
    showBalance: string
    approve: string
    wrap?: string
    unwrap?: string
  }
  tokenDisplay?: {
    name: string
    symbol: string
    decimals: string | number
  }
  // Decimals length via .toFixed(fixedNumberAmount)
  fixedNumberAmount?: number // default = 4
  header?: string | () => React.FC
}

// App
const App: React.FC = () => {
  // some hook that waits window load then loads web3...
  const web3Loaded = useWindowLoaded()
  // some hook that sets prevState.number + 5 on interval
  // changes the value every 5 seconds (5000ms)
  const intervalChange = useInterval(5000)

  return web3Loaded ? (
    <>
      <GlobalStyles />
      <h3>WRAPTOR</h3>
      <FlexColumnContainer width="900px">

        <h5>Token Wraptor</h5>
        <WraptorComponent 
          type="TOKEN" 
          contractAddress={RINKEBY_GNO} 
          provider={provider} 
          userAddress={USER_ADDRESS} 
          tokenDisplay={{
            name: 'Gnosis Token',
            symbol: 'GNO',
            decimals: 18
          }}
          buttonLabels={{
            showAllowance: 'Allowance available',
            showBalance: 'GNO balance available',
            approve: 'Approve GNO'
          }}
          fixedNumberAmount={8}
          header={() => <h3>TOKEN Wrapper</h3>}
        />

        <h5>ETH Wraptor</h5>
        <WraptorComponent 
          type="ETH" 
          contractAddress={RINKEBY_WETH} 
          provider={provider} 
          userAddress={USER_ADDRESS} 
          // Interval change causing state refresh (see above)
          catalyst={intervalChange}
          header='WETH Wrapper' // uses h4 tag if render prop not used
        />

      </FlexColumnContainer>
    </>
  ) : null
}
```

## Running locally

```bash
# Install dependencies
yarn install

# Starts dev server and auto opens tab
yarn start
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