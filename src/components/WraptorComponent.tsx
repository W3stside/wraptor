import React, { useState } from 'react'
import { unstable_batchedUpdates as batchedUpdate } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faLevelUpAlt, faLevelDownAlt, faCheck } from '@fortawesome/free-solid-svg-icons'

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
  catalyst,
  customStyle,
  buttonLabels = {
    showAllowance: 'Current Allowance',
    showBalance: 'Current Balance',
    approve: 'Approve',
    wrap: 'Wrap',
    unwrap: 'Unwrap',
  },
  tokenDisplay,
  fixedNumberAmount = 4,
  header,
}: WraptorComponentProps) => {
  const [approvalAmount, setApprovalAmount] = useState('')
  const [wrappingAmount, setWrappingAmount] = useState('')
  const [unwrappingAmount, setUnwrappingAmount] = useState('')

  const [disabledButton, setDisabledButton] = useState<{ WRAP: boolean; UNWRAP: boolean; APPROVE: boolean }>({
    WRAP: false,
    UNWRAP: false,
    APPROVE: false,
  })
  const [error, setError] = useState()

  const wraptorApi = useWraptor(
    {
      provider,
      contractAddress,
      userAddress,
      catalyst,
    },
    type,
  )

  const { userBalanceWei, getBalance, userAllowanceWei, getAllowance, approve } = wraptorApi

  const handleApproveChange = ({ target: { value } }: TargetValueInterface): void => setApprovalAmount(value)
  const handleWrappingChange = ({ target: { value } }: TargetValueInterface): void => setWrappingAmount(value)
  const handleUnwrappingChange = ({ target: { value } }: TargetValueInterface): void => setUnwrappingAmount(value)

  const handleApproveSubmit = async (amount: string): Promise<void> => {
    try {
      batchedUpdate(() => {
        setError(undefined)
        setDisabledButton(prevState => ({
          ...prevState,
          APPROVE: true,
        }))
      })
      await approve({ amount })
    } catch (error) {
      console.error('APPROVE ERROR: ', error)
      setError(error)
    } finally {
      batchedUpdate(() => {
        setApprovalAmount('')
        setDisabledButton(prevState => ({
          ...prevState,
          APPROVE: false,
        }))
      })
    }
  }
  const handleWrappingSubmit = async (amount: string): Promise<void> => {
    if (!wraptorApi.wrap) return

    try {
      batchedUpdate(() => {
        setError(undefined)
        setDisabledButton(prevState => ({
          ...prevState,
          WRAP: true,
        }))
      })
      await wraptorApi.wrap({ amount })
    } catch (error) {
      console.error('WRAPPING ERROR: ', error)
      setError(error)
    } finally {
      batchedUpdate(() => {
        setWrappingAmount('')
        setDisabledButton(prevState => ({
          ...prevState,
          WRAP: false,
        }))
      })
    }
  }
  const handleUnwrappingSubmit = async (amount: string): Promise<void> => {
    if (!wraptorApi.unwrap) return

    try {
      batchedUpdate(() => {
        setError(undefined)
        setDisabledButton(prevState => ({
          ...prevState,
          UNWRAP: true,
        }))
      })
      await wraptorApi.unwrap({ amount })
    } catch (error) {
      console.error('UNWRAPPING ERROR: ', error)
      setError(error)
    } finally {
      batchedUpdate(() => {
        setUnwrappingAmount('')
        setDisabledButton(prevState => ({
          ...prevState,
          UNWRAP: false,
        }))
      })
    }
  }

  return (
    <WraptorContainer customStyle={customStyle}>
      {header && typeof header === 'function' ? header() : <h3>{header}</h3>}
      {error && <ErrorMessage onClick={(): void => setError(undefined)} message={error.message} />}

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

      {/* APPROVE */}
      <FlexContainer flow="row-reverse wrap" justify="center">
        <WraptorInput
          type="number"
          value={approvalAmount}
          onChange={handleApproveChange}
          disabled={disabledButton['APPROVE']}
        />
        <WraptorButton
          disabled={disabledButton['APPROVE'] || !approvalAmount || +approvalAmount <= 0}
          onClick={(): Promise<void> => handleApproveSubmit(approvalAmount)}
        >
          {buttonLabels.approve}
          {'  '}
          <FontAwesomeIcon
            icon={disabledButton['APPROVE'] ? faSpinner : faCheck}
            size="xs"
            spin={disabledButton['APPROVE']}
          />
        </WraptorButton>
      </FlexContainer>

      {/* WRAPPING */}
      {wraptorApi.wrap && (
        <FlexContainer flow="row-reverse wrap" justify="center">
          <WraptorInput
            type="number"
            value={wrappingAmount}
            onChange={handleWrappingChange}
            disabled={disabledButton['WRAP']}
          />
          <WraptorButton
            disabled={disabledButton['WRAP'] || !wrappingAmount || +wrappingAmount <= 0}
            onClick={(): Promise<void> => handleWrappingSubmit(wrappingAmount)}
          >
            {buttonLabels.wrap}{' '}
            <FontAwesomeIcon
              icon={disabledButton['WRAP'] ? faSpinner : faLevelDownAlt}
              size="xs"
              spin={disabledButton['WRAP']}
            />
          </WraptorButton>
        </FlexContainer>
      )}

      {/* UNWRAPPING */}
      {wraptorApi.unwrap && (
        <FlexContainer flow="row-reverse wrap" justify="center">
          <WraptorInput
            type="number"
            value={unwrappingAmount}
            onChange={handleUnwrappingChange}
            disabled={disabledButton['UNWRAP']}
          />
          <WraptorButton
            disabled={disabledButton['UNWRAP'] || !unwrappingAmount || +unwrappingAmount <= 0}
            onClick={(): Promise<void> => handleUnwrappingSubmit(unwrappingAmount)}
          >
            {buttonLabels.unwrap}{' '}
            <FontAwesomeIcon
              icon={disabledButton['UNWRAP'] ? faSpinner : faLevelUpAlt}
              size="xs"
              spin={disabledButton['UNWRAP']}
            />
          </WraptorButton>
        </FlexContainer>
      )}
    </WraptorContainer>
  )
}

export default WraptorComponent
