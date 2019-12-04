/* eslint-disable @typescript-eslint/no-explicit-any */
import '../src/types'

import React from 'react'
import Web3 from 'web3'

import WraptorComponent from '../src/components/WraptorComponent'
import { FlexContainer } from '../src/components/styled'

import useWindowLoaded from '../src/hooks/useWindowLoaded'

import { RINKEBY_GNO, USER_ADDRESS, RINKEBY_WETH, INITIAL_INFURA_ENDPOINT } from '../src/const'

const provider = new Web3((window as any)?.web3?.currentProvider || INITIAL_INFURA_ENDPOINT)

// App
const App: React.FC = () => {
  const web3Loaded = useWindowLoaded()
  return web3Loaded ? (
    <>
      <h3>WRAPTOR</h3>
      <FlexContainer>
        <h5>Token Wraptor:</h5>
        <WraptorComponent type="TOKEN" contractAddress={RINKEBY_GNO} provider={provider} userAddress={USER_ADDRESS} />
        <h5>ETH Wraptor:</h5>
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
      </FlexContainer>
    </>
  ) : null
}

export default App
