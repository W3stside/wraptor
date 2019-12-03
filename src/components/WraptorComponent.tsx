import React, { useState } from 'react'
import { unstable_batchedUpdates as batchedUpdate } from 'react-dom'

// Types
import { TargetValueInterface, WraptorComponentProps } from '../types'

// useWraptor Hook
import useWraptor from '../hooks/useWraptor'
// Error Comp
import ErrorMessage from './ErrorMessage'
import { tokenName } from '../utils'
import { FlexContainer, WraptorContainer, WraptorCode, WraptorInput, WraptorButton } from './styled'

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
  fixedNumberAmount = 4,
}: WraptorComponentProps) => {
  const [approvalAmount, setApprovalAmount] = useState('')
  const [wrappingAmount, setWrappingAmount] = useState('')
  const [disabledButton, setDisabledButton] = useState<'WRAP' | 'APPROVE'>()
  const [error, setError] = useState()

  // TS hates the tuple conditional type from props passed into
  // overloaded useWraptor definition... fix somehow
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const wraptorApi = useWraptor(type, {
    provider,
    contractAddress,
    userAddress,
  })

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
          {userAllowanceWei ? `${(+userAllowanceWei / 10 ** 18).toFixed(fixedNumberAmount)} ${tokenName(type)}` : '-'}
        </WraptorCode>
      </FlexContainer>
      <FlexContainer flow="row wrap" justify="center">
        <WraptorButton onClick={getBalance}>{buttonLabels.showBalance}</WraptorButton>
        <WraptorCode>
          {userBalanceWei ? `${(+userBalanceWei / 10 ** 18).toFixed(fixedNumberAmount)} ${tokenName(type)}` : '-'}
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
