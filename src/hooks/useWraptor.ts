import { useState, useEffect, useMemo } from 'react'

// WETH9 Abi (Canonical WETH)
import WETH9Abi from '../abi/WETH9Abi'
// ERC20 Abi
import Erc20Abi from '../abi/ERC20Abi'

// Tools/Consts
import { toWei } from 'web3-utils'
import { TOKEN, ETH } from '../const'
import { assert } from '../utils'

// Types
import { WraptorParams, Contract, EthWraptor, Wraptor, TransactionReceipt } from '../types'

function useWraptor({ provider, contractAddress, userAddress, catalyst }: WraptorParams, type: 'TOKEN'): Wraptor
function useWraptor({ provider, contractAddress, userAddress, catalyst }: WraptorParams, type?: 'ETH'): EthWraptor
function useWraptor({ provider, contractAddress, userAddress, catalyst }: WraptorParams, type?: string): EthWraptor
function useWraptor(
  { provider, contractAddress, userAddress, catalyst }: WraptorParams,
  type?: 'ETH' | 'TOKEN' | string,
): EthWraptor | Wraptor | null {
  if (type && type !== ETH && type !== TOKEN) console.warn(`${type} is not supported, defaulting to ETH Wraptor`)

  const [contract, setContract] = useState<Contract>()
  const [tokenDisplay, setTokenDisplay] = useState()
  const [userBalanceWei, setUserBalanceWei] = useState()
  const [userAllowanceWei, setUserAllowanceWei] = useState()

  // Load contract on mount
  useEffect(() => {
    const loadContract = async (): Promise<void> => {
      if (!provider || !provider.eth) return

      const finalContractAbi = type === TOKEN ? Erc20Abi : WETH9Abi
      const contract = new provider.eth.Contract(finalContractAbi, contractAddress)

      return setContract(contract)
    }
    loadContract()
  }, [contractAddress, type, provider])

  // *****************************************************
  // PRIVATE METHODS
  const {
    _getName,
    _getSymbol,
    _getDecimals,
    _getUserBalance,
    _getUserAllowance,
    _approve,
    _deposit,
    _withdraw,
  } = useMemo(() => {
    const _getName = async (): Promise<string> => contract?.methods?.name().call()
    const _getSymbol = async (): Promise<string> => contract?.methods?.symbol().call()
    const _getDecimals = async (): Promise<string> => contract?.methods?.decimals().call()
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
    const _withdraw = async ({ amount }: { amount: string }): Promise<TransactionReceipt> =>
      contract?.methods?.withdraw(amount).send({ from: userAddress })

    return {
      _getName,
      _getSymbol,
      _getDecimals,
      _getUserBalance,
      _getUserAllowance,
      _approve,
      _deposit,
      _withdraw,
    }
  }, [contract, userAddress])

  // *****************************************************
  // PUBLIC METHODS
  const { getTokenDisplay, getBalance, getAllowance, approve, wrap, unwrap } = useMemo(() => {
    const getTokenDisplay = async (): Promise<void> => {
      const [name, symbol, decimals] = await Promise.all([
        _getName().catch(() => undefined),
        _getSymbol().catch(() => undefined),
        _getDecimals().catch(() => undefined),
      ])

      return setTokenDisplay({
        name,
        symbol,
        decimals,
      })
    }
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
      assert(spenderAddress, 'Must have a spender address')

      const formattedAmount = toWei(amount)
      return _approve({ spenderAddress, amount: formattedAmount })
    }
    const wrap = async ({ amount }: { amount: string }): Promise<TransactionReceipt> => {
      const formattedAmount = toWei(amount)
      return _deposit({ amount: formattedAmount })
    }
    const unwrap = async ({ amount }: { amount: string }): Promise<TransactionReceipt> => {
      const formattedAmount = toWei(amount)
      return _withdraw({ amount: formattedAmount })
    }

    return {
      getTokenDisplay,
      getBalance,
      getAllowance,
      approve,
      wrap,
      unwrap,
    }
  }, [_approve, _deposit, _getDecimals, _getName, _getSymbol, _getUserAllowance, _getUserBalance, _withdraw, contract])

  // Constant state values refresh hook
  useEffect(() => {
    Promise.all([getTokenDisplay(), getAllowance(), getBalance()])
  }, [catalyst, getAllowance, getBalance, getTokenDisplay])

  if (!provider || !contractAddress || !userAddress) return null

  // Return logic
  const baseReturn: Wraptor = {
    contract,
    tokenDisplay,
    userBalanceWei,
    getBalance,
    userAllowanceWei,
    getAllowance,
    getTokenDisplay,
    approve,
  }

  // Return Token wraptor without wrap e.g deposit function
  if (type === TOKEN) return baseReturn
  // Return ETH wrapping token API with wrap e.g deposit function
  return { ...baseReturn, wrap, unwrap }
}

export default useWraptor
