// Web3/Provider related
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import { Eth } from 'web3-eth'
import { TransactionReceipt } from 'web3-core'

export interface ExampleApiInterface {
  somePublicMethod(): string
  someOtherPublicMethodCallingGetter(): string
}

export interface BaseWraptorParams {
  provider:
    | Web3
    | {
        currentProvider: {
          constructor: Function
        }
        eth: Eth
      }
  contractAddress: string
  userAddress: string
  showTestData?: boolean
}

export interface TokenWraptorParams extends BaseWraptorParams {
  contractAbi: AbiItem[]
}

interface BaseWraptor {
  userBalanceWei: string
  userAllowanceWei: string
  getUserBalance: () => Promise<void>
  getUserAllowance: () => Promise<void>
}

export interface EthWraptor extends BaseWraptor {
  approveEther: ({ spenderAddress, amount }: { spenderAddress?: string; amount: string }) => Promise<TransactionReceipt>
  wrapEther: ({ amount }: { amount: string }) => Promise<TransactionReceipt>
}

export interface TokenWraptor extends BaseWraptor {
  approveToken: ({ spenderAddress, amount }: { spenderAddress?: string; amount: string }) => Promise<TransactionReceipt>
  // wrapToken: ({ spenderAddress, amount }: { spenderAddress?: string; amount: string }) => Promise<TransactionReceipt>
}

export interface TargetValueInterface {
  target: { value: string }
}

export { Contract, TransactionReceipt, AbiItem }
