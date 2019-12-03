import { AbiItem } from 'web3-utils'
// Abis
import Erc20Abi from '../abi/ERC20Abi'
import WETH9Abi from '../abi/WETH9Abi'
// Constants
import { ETH, TOKEN } from '../const'

export function checkTypeAndAbi(type?: string, abi?: AbiItem[]): AbiItem[] {
  if (abi) return abi
  else if (type === ETH) return WETH9Abi
  else if (type === TOKEN) return Erc20Abi

  return Erc20Abi
}

export function tokenName(type?: string): string {
  return !type || type === 'ETH' ? 'WETH' : 'TOKEN'
}
