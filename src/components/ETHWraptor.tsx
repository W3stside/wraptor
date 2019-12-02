import React, { useState } from 'react'

// Types
import { BaseWraptorParams, TransactionReceipt, TargetValueInterface } from 'types'

// useETHWraptor Hook
import useETHWraptor from 'hooks/useEthWraptor'

const ETHWraptor: React.FC<BaseWraptorParams> = ({ provider, contractAddress, userAddress }: BaseWraptorParams) => {
  const [approvalAmount, setApprovalAmount] = useState()
  const [wrappingAmount, setWrappingAmount] = useState()
  const { userBalanceWei, getUserBalance, userAllowanceWei, getUserAllowance, approveEther, wrapEther } = useETHWraptor(
    {
      provider,
      contractAddress,
      userAddress,
    },
  )

  const handleAllowanceChange = ({ target: { value } }: TargetValueInterface): void => setApprovalAmount(value)
  const handleWrapping = ({ target: { value } }: TargetValueInterface): void => setWrappingAmount(value)

  return (
    <div>
      <div>
        <button onClick={getUserAllowance}>Show allowance:</button>
        <code>{userAllowanceWei ? `${+userAllowanceWei / 10 ** 18} WETH` : '-'}</code>
        <div>
          <button onClick={getUserBalance}>Show balance:</button>
          <code>{userBalanceWei ? `${+userBalanceWei / 10 ** 18} WETH` : '-'}</code>
        </div>
      </div>
      <div>
        <button onClick={(): Promise<TransactionReceipt> => approveEther({ amount: approvalAmount })}>Approve</button>
        <input type="number" onChange={handleAllowanceChange} />
      </div>
      <div>
        <button onClick={(): Promise<TransactionReceipt> => wrapEther({ amount: wrappingAmount })}>Wrap</button>
        <input type="number" onChange={handleWrapping} />
      </div>
    </div>
  )
}

export default ETHWraptor
