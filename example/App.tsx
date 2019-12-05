/* eslint-disable @typescript-eslint/no-explicit-any */
import '../src/types'

import React from 'react'
import Web3 from 'web3'

import WraptorComponent from '../src/components/WraptorComponent'
import { FlexContainer } from '../src/components/styled'

import useWindowLoaded from '../src/hooks/useWindowLoaded'
import useWraptor from '../src/hooks/useWraptor'

import { RINKEBY_GNO, USER_ADDRESS, RINKEBY_WETH, INITIAL_INFURA_ENDPOINT } from '../src/const'
import ReactDOM from 'react-dom'

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

const root = document.getElementById('root')
ReactDOM.render(<App />, root)
