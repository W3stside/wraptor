import React, { useState } from 'react'

// Types
import { TokenWraptorParams, TargetValueInterface, TransactionReceipt } from 'types'

// useWraptor Hook
import useWraptor from 'hooks/useWraptor'

// Misc
import ERC20Abi from 'abi/ERC20Abi'

const Wraptor: React.FC<TokenWraptorParams> = ({
  provider,
  contractAbi = ERC20Abi,
  contractAddress,
  userAddress,
}: TokenWraptorParams) => {
  const [approvalAmount, setApprovalAmount] = useState()
  const { userBalanceWei, getUserBalance, userAllowanceWei, getUserAllowance, approveToken } = useWraptor({
    provider,
    contractAbi,
    contractAddress,
    userAddress,
  })

  const handleAllowanceChange = ({ target: { value } }: TargetValueInterface): void => setApprovalAmount(value)

  return (
    <div>
      {/* buttons */}
      <div>
        <button onClick={getUserBalance}>Show user balance:</button>
        <code>{userBalanceWei ? `${+userBalanceWei / 10 ** 18} WETH` : '-'}</code>
      </div>
      <div>
        <button onClick={getUserAllowance}>Show user allowance:</button>
        <code>{userAllowanceWei ? `${+userAllowanceWei / 10 ** 18} WETH` : '-'}</code>
      </div>
      <div>
        <input type="number" onChange={handleAllowanceChange} />
        <button onClick={(): Promise<TransactionReceipt> => approveToken({ amount: approvalAmount })}>
          Submit amount to approve
        </button>
      </div>
    </div>
  )
}

export default Wraptor
