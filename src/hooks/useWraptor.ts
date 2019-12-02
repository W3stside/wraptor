import { useState, useEffect } from 'react'

import { TokenWraptorParams, Contract, TransactionReceipt, TokenWraptor } from 'types'
import { toWei } from 'web3-utils'

// Misc
import ERC20Abi from 'abi/ERC20Abi'

export default ({
  provider,
  contractAbi = ERC20Abi,
  contractAddress,
  userAddress,
}: TokenWraptorParams): TokenWraptor => {
  const [contract, setContract] = useState<Contract>()
  // Methods and return values
  const [userBalanceWei, setUserBalanceWei] = useState()
  const [userAllowanceWei, setUserAllowanceWei] = useState()

  useEffect(() => {
    const loadContract = async (): Promise<void> => {
      const contract = new provider.eth.Contract(contractAbi, contractAddress)

      return setContract(contract)
    }
    loadContract()
  }, [contractAbi, contractAddress, provider.eth.Contract])

  // Private
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
  // const _wrap = async (): Promise<string> =>
  //   contract?.methods?.allowance(userAddress, contract.options.address).call({ from: userAddress })

  // Public
  const getUserBalance = async (): Promise<void> => {
    const amount = await _getUserBalance()

    return setUserBalanceWei(amount)
  }
  const getUserAllowance = async (): Promise<void> => {
    const amount = await _getUserAllowance()

    return setUserAllowanceWei(amount)
  }
  const approveToken = async ({
    spenderAddress = contract?.options.address,
    amount,
  }: {
    spenderAddress?: string
    amount: string
  }): Promise<TransactionReceipt> => {
    if (!spenderAddress) throw new Error('Blah')

    const formattedAmount = toWei(amount)
    return _approve({ spenderAddress, amount: formattedAmount })
  }
  // const wrapToken = async ({ amount }: { amount: string }): Promise<TransactionReceipt> => {
  //   const formattedAmount = toWei(amount)
  //   // return _wrap({ spenderAddress, amount: formattedAmount })
  // }

  return { userBalanceWei, getUserBalance, userAllowanceWei, getUserAllowance, approveToken }
}
