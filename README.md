# 🦖 WRAPTOR 🦖 
## Ether <-> WETH Wrapper and Unwrapper
##### Built on React 16.8+ (hooks) & Typescript 3.72+

Handles wrapping Ether to Wrapped Ether (WETH) via `useWraptor` hook and/or the `WraptorComponent`

## Using useWraptor Hook

#### Type: 'ETH' | undefined
```ts
// ETH > WETH Wrapping hook
useWraptor({
    provider,
    contractAddress,
    userAddress,
  }, type?: 'ETH')

// NOTE: leaving out type (i.e undefined) is an alias

/** Returns WETH wrapper API:

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

**/
```

#### Type: 'TOKEN'
```ts
// mini Token API hook
useWraptor({
    provider,
    contractAddress,
    userAddress,
  }, type: 'TOKEN')

/** Returns Token API:

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

**/

// NOTE: Cannot wrap with this API - just approve and get constants
```

## Using WraptorComponent
```tsx
// ... //

const provider = new Web3(window?.web3?.currentProvider || INITIAL_INFURA_ENDPOINT)

interface WraptorComponentProps {
  type: 'ETH' | 'TOKEN'
  provider: Web3
  contractAddress: string
  userAddress: string
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

# Start dev server in http://localhost:8080
yarn start
```

Open http://localhost:8080 in any browser.

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