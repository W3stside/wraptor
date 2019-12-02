/* eslint-disable @typescript-eslint/ban-ts-ignore */
import 'types'

import React, { useEffect, useState } from 'react'
import { hot } from 'react-hot-loader/root'

// SCSS
import GlobalStyles from './components/layout/GlobalStyles'
// Main layout
import Layout from 'components/layout/'
// Pages
import Wraptor from 'components/Wraptor'

import Web3 from 'web3'
import Erc20Abi from 'abi/ERC20Abi'
import ETHWraptor from 'components/ETHWraptor'

// TEST DATA
const RINKEBY_WETH = '0xc778417e063141139fce010982780140aa0cd5ab'
const INITIAL_INFURA_ENDPOINT = 'wss://rinkeby.infura.io/ws/v3/8b4d9b4306294d2e92e0775ff1075066'
// @ts-ignore
const provider = new Web3(window?.web3?.currentProvider || INITIAL_INFURA_ENDPOINT)
const USER_ADDRESS = '0xfa3a5ba1864C4567aC77D50EcD91a2AaE92B650D'

const windowLoad = new Promise((accept, reject) => {
  if (!window) reject('No window')
  window.addEventListener('load', function listener() {
    window.removeEventListener('load', listener)
    return accept('Window loaded')
  })
})

// App
const App: React.FC = () => {
  const [web3Loaded, setWeb3Loaded] = useState(false)
  useEffect(() => {
    windowLoad.then((res: unknown): void => console.debug(res)).then(() => setWeb3Loaded(true))
  })
  return web3Loaded ? (
    <>
      <GlobalStyles />
      <Layout>
        <h3>WRAPTOR</h3>
        <h5>Token Wraptor:</h5>
        <Wraptor contractAbi={Erc20Abi} contractAddress={RINKEBY_WETH} provider={provider} userAddress={USER_ADDRESS} />
        <h5>ETH Wraptor:</h5>
        <ETHWraptor contractAddress={RINKEBY_WETH} provider={provider} userAddress={USER_ADDRESS} />
      </Layout>
    </>
  ) : null
}

export default hot(App)
