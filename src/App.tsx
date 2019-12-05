/* eslint-disable @typescript-eslint/no-explicit-any */
import 'types'

import { hot } from 'react-hot-loader/root'
import React from 'react'
import Web3 from 'web3'

// SCSS
import GlobalStyles from './GlobalStyles'

import WraptorComponent from 'components/WraptorComponent'
import { FlexContainer } from 'components/styled'

import useWindowLoaded from 'hooks/useWindowLoaded'

import { RINKEBY_GNO, USER_ADDRESS, RINKEBY_WETH, INITIAL_INFURA_ENDPOINT } from 'const'
import useWraptor from 'hooks/useWraptor'

const provider = new Web3((window as any)?.web3?.currentProvider || INITIAL_INFURA_ENDPOINT)

// App
const App: React.FC = () => {
  const web3Loaded = useWindowLoaded()
  const { userBalanceWei, userAllowanceWei, getBalance, getAllowance } = useWraptor({
    provider,
    userAddress: USER_ADDRESS,
    contractAddress: RINKEBY_WETH,
  })
  const {
    userBalanceWei: tokenUserBalanceWei,
    userAllowanceWei: tokenUserAllowanceWei,
    getBalance: tokenGetBalance,
    getAllowance: tokenGetAllowance,
    tokenDisplay,
    getTokenDisplay,
  } = useWraptor({ provider, userAddress: USER_ADDRESS, contractAddress: RINKEBY_GNO }, 'TOKEN')

  return web3Loaded ? (
    <>
      <GlobalStyles />
      <h3>WRAPTOR</h3>
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
        />
        <h5>ETH Wraptor Component:</h5>
        <WraptorComponent
          type="ETH"
          contractAddress={RINKEBY_WETH}
          provider={provider}
          userAddress={USER_ADDRESS}
          customStyle={{
            width: 'auto',
            background: '#fff',
          }}
        />
        <h5>WETH Wraptor Hook</h5>
        <div>
          <p>
            {userBalanceWei || '...'}
            <button style={{ margin: '2px 10px' }} onClick={(): Promise<void> => getBalance()}>
              Get WETH Bal
            </button>
          </p>
          <p>
            {userAllowanceWei || '...'}
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
            {tokenUserBalanceWei || '...'} {tokenDisplay?.symbol}
            <button style={{ margin: '2px 10px' }} onClick={(): Promise<void> => tokenGetBalance()}>
              Get Token Bal
            </button>
          </p>
          <p>
            {tokenUserAllowanceWei || '...'}
            <button style={{ margin: '2px 10px' }} onClick={(): Promise<void> => tokenGetAllowance()}>
              Get Token Allow
            </button>
          </p>
        </div>
      </FlexContainer>
    </>
  ) : null
}

export default hot(App)
