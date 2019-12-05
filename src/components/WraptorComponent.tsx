import React, { useState } from 'react'
import { unstable_batchedUpdates as batchedUpdate } from 'react-dom'

// Types
import { TargetValueInterface, WraptorComponentProps } from '../types'

// useWraptor Hook
import useWraptor from '../hooks/useWraptor'
// Error Comp
import ErrorMessage from './ErrorMessage'
import { FlexContainer, WraptorContainer, WraptorCode, WraptorInput, WraptorButton } from './styled'

import { tokenName, toNativeDecimals } from '../utils'

const WraptorComponent: React.FC<WraptorComponentProps> = ({
  type,
  provider,
  contractAddress,
  userAddress,
  customStyle,
  buttonLabels = {
    showAllowance: 'Show Allowance',
    showBalance: 'Show Balance',
    approve: 'Approve',
    wrap: 'Wrap',
  },
  tokenDisplay,
  fixedNumberAmount = 4,
}: WraptorComponentProps) => {
  const [approvalAmount, setApprovalAmount] = useState('')
  const [wrappingAmount, setWrappingAmount] = useState('')
  const [disabledButton, setDisabledButton] = useState<'WRAP' | 'APPROVE'>()
  const [error, setError] = useState()

  const wraptorApi = useWraptor(
    {
      provider,
      contractAddress,
      userAddress,
    },
    type,
  )

  const { userBalanceWei, getBalance, userAllowanceWei, getAllowance, approve } = wraptorApi

  const handleApproveChange = ({ target: { value } }: TargetValueInterface): void => setApprovalAmount(value)
  const handleWrappingChange = ({ target: { value } }: TargetValueInterface): void => setWrappingAmount(value)
  const handleApproveSubmit = async (amount: string): Promise<void> => {
    try {
      batchedUpdate(() => {
        setError(undefined)
        setDisabledButton('APPROVE')
      })
      await approve({ amount })
    } catch (error) {
      console.error('APPROVE ERROR: ', error)
      setError(error)
    } finally {
      batchedUpdate(() => {
        setApprovalAmount('')
        setDisabledButton(undefined)
      })
    }
  }
  const handleWrappingSubmit = async (amount: string): Promise<void> => {
    if (!wraptorApi.wrap) return

    try {
      batchedUpdate(() => {
        setError(undefined)
        setDisabledButton('WRAP')
      })
      await wraptorApi.wrap({ amount })
    } catch (error) {
      console.error('WRAPPING ERROR: ', error)
      setError(error)
    } finally {
      batchedUpdate(() => {
        setWrappingAmount('')
        setDisabledButton(undefined)
      })
    }
  }

  return (
    <WraptorContainer customStyle={customStyle}>
      {error && <ErrorMessage message={error.message} />}
      <FlexContainer flow="row wrap" justify="center">
        <WraptorButton onClick={getAllowance}>{buttonLabels.showAllowance}</WraptorButton>
        <WraptorCode>
          {userAllowanceWei
            ? `${toNativeDecimals(userAllowanceWei, tokenDisplay?.decimals).toFixed(
                fixedNumberAmount,
              )} ${tokenDisplay?.symbol || tokenName(type)}`
            : '-'}
        </WraptorCode>
      </FlexContainer>
      <FlexContainer flow="row wrap" justify="center">
        <WraptorButton onClick={getBalance}>{buttonLabels.showBalance}</WraptorButton>
        <WraptorCode>
          {userBalanceWei
            ? `${toNativeDecimals(userBalanceWei, tokenDisplay?.decimals).toFixed(
                fixedNumberAmount,
              )} ${tokenDisplay?.symbol || tokenName(type)}`
            : '-'}
        </WraptorCode>
      </FlexContainer>
      <FlexContainer flow="row wrap" justify="center">
        <WraptorButton
          cursorDisabled={disabledButton === 'APPROVE' || !approvalAmount}
          disabled={disabledButton === 'APPROVE' || !approvalAmount}
          onClick={(): Promise<void> => handleApproveSubmit(approvalAmount)}
        >
          {buttonLabels.approve}
        </WraptorButton>
        <WraptorInput type="number" value={approvalAmount} onChange={handleApproveChange} />
      </FlexContainer>
      {wraptorApi.wrap && (
        <FlexContainer flow="row wrap" justify="center">
          <WraptorButton
            cursorDisabled={disabledButton === 'WRAP' || !wrappingAmount}
            disabled={disabledButton === 'WRAP' || !wrappingAmount}
            onClick={(): Promise<void> => handleWrappingSubmit(wrappingAmount)}
          >
            {buttonLabels.wrap}
          </WraptorButton>
          <WraptorInput type="number" value={wrappingAmount} onChange={handleWrappingChange} />
        </FlexContainer>
      )}
    </WraptorContainer>
  )
}

export default WraptorComponent
