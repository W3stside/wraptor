import { useState, useEffect } from 'react'
import { toWei } from 'web3-utils'

// WETH9 Abi (Canonical WETH)
import WETH9Abi from '../abi/WETH9Abi'
// ERC20 Abi
import Erc20Abi from '../abi/ERC20Abi'

import { TOKEN, ETH } from '../const'
import { WraptorParams, Contract, EthWraptor, Wraptor, TransactionReceipt } from '../types'

function useWraptor(type: undefined, { provider, contractAddress, userAddress }: WraptorParams): EthWraptor
function useWraptor(type: 'ETH', { provider, contractAddress, userAddress }: WraptorParams): EthWraptor
function useWraptor(type: 'TOKEN', { provider, contractAddress, userAddress }: WraptorParams): Wraptor
function useWraptor(
  type: 'ETH' | 'TOKEN' | undefined,
  { provider, contractAddress, userAddress }: WraptorParams,
): EthWraptor | Wraptor {
  const [contract, setContract] = useState<Contract>()
  // Methods and return values
  const [userBalanceWei, setUserBalanceWei] = useState()
  const [userAllowanceWei, setUserAllowanceWei] = useState()

  // Load contract on mount
  useEffect(() => {
    const loadContract = async (): Promise<void> => {
      const finalContractAbi = type === TOKEN ? Erc20Abi : WETH9Abi
      const contract = new provider.eth.Contract(finalContractAbi, contractAddress)

      return setContract(contract)
    }
    loadContract()
  }, [contractAddress, provider.eth.Contract, type])

  // *****************************************************
  // PRIVATE METHODS
  const _getUserBalance = async (): Promise<string> =>
    contract?.methods?.balanceOf(userAddress).call({ from: userAddress })

  const _getUserAllowance = async (): Promise<string> =>
    contract?.methods?.allowance(userAddress, contract.options.address).call({ from: userAddress })

  const _approve = async ({
    spenderAddress,
    amount,
  }: {
    spenderAddress: string
    amount: string
  }): Promise<TransactionReceipt> => contract?.methods?.approve(spenderAddress, amount).send({ from: userAddress })

  const _deposit = async ({ amount }: { amount: string }): Promise<TransactionReceipt> =>
    contract?.methods?.deposit().send({ from: userAddress, value: amount })

  // *****************************************************
  // PUBLIC METHODS

  const getBalance = async (): Promise<void> => {
    const amount = await _getUserBalance()

    return setUserBalanceWei(amount)
  }

  const getAllowance = async (): Promise<void> => {
    const amount = await _getUserAllowance()

    return setUserAllowanceWei(amount)
  }

  const approve = async ({
    spenderAddress = contract?.options.address,
    amount,
  }: {
    spenderAddress?: string
    amount: string
  }): Promise<TransactionReceipt> => {
    // TODO: change with assert
    if (!spenderAddress) throw new Error('No spender address specified, aborting.')

    const formattedAmount = toWei(amount)
    return _approve({ spenderAddress, amount: formattedAmount })
  }

  const wrap = async ({ amount }: { amount: string }): Promise<TransactionReceipt> => {
    const formattedAmount = toWei(amount)
    return _deposit({ amount: formattedAmount })
  }

  // Return logic
  const baseReturn = { userBalanceWei, getBalance, userAllowanceWei, getAllowance, approve }

  // Return ETH wrapping token API with wrap e.g deposit function
  if (!type || type === ETH) return { ...baseReturn, wrap }
  // Return Token wraptor without wrap e.g deposit function
  return baseReturn
}

export default useWraptor
