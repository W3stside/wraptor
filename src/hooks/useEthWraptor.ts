import { useState, useEffect } from 'react'

import { toWei } from 'web3-utils'
import { BaseWraptorParams, Contract, EthWraptor, TransactionReceipt } from 'types'

// WETH9 Abi (Canonical WETH)
import WETH9Abi from 'abi/WETH9Abi'

export default ({ provider, contractAddress, userAddress }: BaseWraptorParams): EthWraptor => {
  const [contract, setContract] = useState<Contract>()
  // Methods and return values
  const [userBalanceWei, setUserBalanceWei] = useState()
  const [userAllowanceWei, setUserAllowanceWei] = useState()

  // Load contract on mount
  useEffect(() => {
    const loadContract = async (): Promise<void> => {
      const contract = new provider.eth.Contract(WETH9Abi, contractAddress)

      return setContract(contract)
    }
    loadContract()
  }, [contractAddress, provider.eth.Contract])

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

  const getUserBalance = async (): Promise<void> => {
    const amount = await _getUserBalance()

    return setUserBalanceWei(amount)
  }

  const getUserAllowance = async (): Promise<void> => {
    const amount = await _getUserAllowance()

    return setUserAllowanceWei(amount)
  }

  const approveEther = async ({
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
  const wrapEther = async ({ amount }: { amount: string }): Promise<TransactionReceipt> => {
    const formattedAmount = toWei(amount)
    return _deposit({ amount: formattedAmount })
  }

  return { userBalanceWei, getUserBalance, userAllowanceWei, getUserAllowance, approveEther, wrapEther }
}
