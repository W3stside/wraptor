import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDizzy } from '@fortawesome/free-regular-svg-icons'

const ErrorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  background: #ffdddd;
  border-radius: 2px;
  color: red;
  font-size: small;
  font-weight: 600;
  padding: 0.65rem;

  > code {
    margin: 0 10px;
  }
`

const ErrorMessage: React.FC<{
  message: string
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}> = ({ message, onClick }) => (
  <ErrorWrapper onClick={onClick}>
    <FontAwesomeIcon icon={faDizzy} size="2x" />
    <code>{message}</code>
  </ErrorWrapper>
)

export default ErrorMessage
