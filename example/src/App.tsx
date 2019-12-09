/* eslint-disable @typescript-eslint/no-explicit-any */
import '../../src/types'

import React from 'react'
import Web3 from 'web3'

import WraptorComponent from '../../src/components/WraptorComponent'
import { FlexContainer } from '../../src/components/styled'

import useInterval from './useInterval'
import useWindowLoaded from './useWindowLoaded'
import useWraptor from '../../src/hooks/useWraptor'

import { RINKEBY_GNO, USER_ADDRESS, RINKEBY_WETH, INITIAL_INFURA_ENDPOINT } from './const'

const provider = new Web3((window as any)?.web3?.currentProvider || INITIAL_INFURA_ENDPOINT)

const AppData: React.FC<{ provider: typeof provider }> = ({ provider }) => {
  const intervalChange = useInterval()

  // WETH Wraptor hook
  // Uses polling for state update
  const { userBalanceWei, userAllowanceWei, getBalance, getAllowance } = useWraptor({
    provider,
    userAddress: USER_ADDRESS,
    contractAddress: RINKEBY_WETH,
    catalyst: intervalChange
  })
  // TOKEN Wraptor hook
  const {
    userBalanceWei: tokenUserBalanceWei,
    userAllowanceWei: tokenUserAllowanceWei,
    getBalance: tokenGetBalance,
    getAllowance: tokenGetAllowance,
    tokenDisplay,
    getTokenDisplay,
  } = useWraptor({ provider, userAddress: USER_ADDRESS, contractAddress: RINKEBY_GNO }, 'TOKEN')

  return (
    <>
      <h3>WRAPTOR</h3>
      <strong>Interval change tracker: {intervalChange}</strong>
      <FlexContainer>
        <h5>Token Wraptor Component:</h5>
        <WraptorComponent
          type="TOKEN"
          contractAddress={RINKEBY_GNO}
          provider={provider}
          userAddress={USER_ADDRESS}
          tokenDisplay={{
            name: 'Gnosis',
            decimals: 18,
            symbol: 'GNO',
          }}
          customStyle={{ width: '40%' }}
        />
        <h5>ETH Wraptor Component:</h5>
        <code>Uses <strong>useInterval</strong> as a polling mechanism that auto refreshes state.</code>
        <code>Try changing allowance and watch state auto update.</code>
        <WraptorComponent
          type="ETH"
          contractAddress={RINKEBY_WETH}
          provider={provider}
          userAddress={USER_ADDRESS}
          catalyst={intervalChange}
          customStyle={{
            width: '50%',
            background: '#fff',
          }}
        />
        <h5>WETH Wraptor Hook</h5>
        <code>Uses <strong>useInterval</strong> as a polling mechanism that auto refreshes state.</code>
        <code>Try changing allowance and watch state auto update.</code>
        <div>
          <p>
            {(userBalanceWei && (+userBalanceWei/10**18).toFixed(4)) ?? '...'}
            <button style={{ margin: '2px 10px' }} onClick={(): Promise<void> => getBalance()}>
              Get WETH Bal
            </button>
          </p>
          <p>
            {(userAllowanceWei && (+userAllowanceWei/10**18).toFixed(4)) ?? '...'}
            <button style={{ margin: '2px 10px' }} onClick={(): Promise<void> => getAllowance()}>
              Get WETH Allow
            </button>
          </p>
        </div>
        <h5>Token Wraptor Hook</h5>
        <div>
          <p>
            Get token display info: <button onClick={(): Promise<void> => getTokenDisplay()}>Get info</button>
          </p>
          <p>
            {(tokenUserBalanceWei && (+tokenUserBalanceWei/10**((tokenDisplay?.decimals && Number(tokenDisplay.decimals)) || 18)).toFixed(4)) ?? '...'} {tokenDisplay?.symbol}
            <button style={{ margin: '2px 10px' }} onClick={(): Promise<void> => tokenGetBalance()}>
              Get Token Bal
            </button>
          </p>
          <p>
            {(tokenUserAllowanceWei && (+tokenUserAllowanceWei/10**((tokenDisplay?.decimals && Number(tokenDisplay.decimals)) || 18)).toFixed(4)) ?? '...'}
            <button style={{ margin: '2px 10px' }} onClick={(): Promise<void> => tokenGetAllowance()}>
              Get Token Allow
            </button>
          </p>
        </div>
      </FlexContainer>
    </>
  )
}

// App
const App: React.FC = () => {
  const web3Loaded = useWindowLoaded()
  return web3Loaded && provider ? <div><AppData provider={provider}/></div> : <div><h1>Error! No provider found.</h1></div>
}

export default App
