/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { useState, useEffect, useMemo } from 'react'

// WETH9 Abi (Canonical WETH)
import WETH9Abi from '../abi/WETH9Abi'
// ERC20 Abi
import Erc20Abi from '../abi/ERC20Abi'

// Tools/Consts
import { toWei } from 'web3-utils'
import { TOKEN, ETH } from '../const'
import { assert, tokenAssertMessage } from '../utils'

// Types
import { WraptorParams, Contract, EthWraptor, Wraptor, TransactionReceipt, SimpleERC20 } from '../types'

function useWraptor({ provider, contractAddress, userAddress, catalyst }: WraptorParams, type: 'TOKEN'): Wraptor
function useWraptor({ provider, contractAddress, userAddress, catalyst }: WraptorParams, type?: 'ETH'): EthWraptor
function useWraptor({ provider, contractAddress, userAddress, catalyst }: WraptorParams, type?: string): EthWraptor
function useWraptor(
  { provider, contractAddress, userAddress, catalyst }: WraptorParams,
  type?: 'ETH' | 'TOKEN' | string,
): EthWraptor | Wraptor {
  if (type && type !== ETH && type !== TOKEN) console.warn(`${type} is not supported, defaulting to ETH Wraptor`)

  const [contract, setContract] = useState<Contract>()
  const [tokenDisplay, setTokenDisplay] = useState<SimpleERC20>()
  const [userBalanceWei, setUserBalanceWei] = useState<string>()
  const [userAllowanceWei, setUserAllowanceWei] = useState<string>()

  // Load contract on mount
  useEffect(() => {
    const loadContract = async (): Promise<void> => {
      const finalContractAbi = type === TOKEN ? Erc20Abi : WETH9Abi
      // @ts-ignore
      const contractConstructor = provider?.eth?.Contract || provider?.eth?.contract

      if (contractConstructor) {
        const contract = new contractConstructor(finalContractAbi, contractAddress)

        return setContract(contract)
      } else {
        console.error('No valid Provider / Eth API detected.')
      }
    }
    loadContract()
  }, [contractAddress, type, provider])

  // *****************************************************
  // PRIVATE METHODS
  const {
    _getUserEtherBalance,
    _getName,
    _getSymbol,
    _getDecimals,
    _getTokenBalance,
    _getUserAllowance,
    _approve,
    _deposit,
    _withdraw,
  } = useMemo(() => {
    const _getUserEtherBalance = async (): Promise<string> => provider.eth.getBalance(userAddress)
    const _getName = async (): Promise<string> => contract?.methods?.name().call()
    const _getSymbol = async (): Promise<string> => contract?.methods?.symbol().call()
    const _getDecimals = async (): Promise<number> => contract?.methods?.decimals().call()
    const _getTokenBalance = async (): Promise<string> =>
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
      _getUserEtherBalance,
      _getName,
      _getSymbol,
      _getDecimals,
      _getTokenBalance,
      _getUserAllowance,
      _approve,
      _deposit,
      _withdraw,
    }
  }, [contract, provider, userAddress])

  // *****************************************************
  // PUBLIC METHODS
  const { getTokenDisplay, getBalance, getAllowance, approve, wrap, unwrap } = useMemo(() => {
    const getTokenDisplay = async (): Promise<void> => {
      const [name, symbol, decimals] = await Promise.all([
        _getName().catch(() => undefined),
        _getSymbol().catch(() => undefined),
        _getDecimals().catch(() => 18),
      ])

      return setTokenDisplay({
        name,
        symbol,
        decimals: decimals || 18,
      })
    }

    const getBalance = async (): Promise<void> => {
      const amount = await _getTokenBalance()

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
      const userEth = await _getUserEtherBalance()

      assert(+userEth > +formattedAmount, tokenAssertMessage('wrap', formattedAmount, userEth, 18))
      return _deposit({ amount: formattedAmount })
    }

    const unwrap = async ({ amount }: { amount: string }): Promise<TransactionReceipt> => {
      const formattedAmount = toWei(amount)
      const userWeth = await _getTokenBalance()

      assert(+userWeth > +formattedAmount, tokenAssertMessage('unwrap', formattedAmount, userWeth, 18))
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
  }, [
    _getName,
    _getSymbol,
    _getDecimals,
    _getTokenBalance,
    _getUserAllowance,
    contract,
    _approve,
    _getUserEtherBalance,
    _deposit,
    _withdraw,
  ])

  // Constant state values refresh hook
  useEffect(() => {
    Promise.all([getTokenDisplay(), getAllowance(), getBalance()])
  }, [catalyst, getAllowance, getBalance, getTokenDisplay])

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
