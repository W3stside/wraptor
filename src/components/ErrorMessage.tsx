import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDizzy } from '@fortawesome/free-regular-svg-icons'
import { ErrorWrapper, ErrorCloseWrapper } from './styled'

const ErrorMessage: React.FC<{
  message: string
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}> = ({ message, onClick }) => (
  <ErrorWrapper onClick={onClick}>
    <ErrorCloseWrapper>
      <div>X</div>
    </ErrorCloseWrapper>
    <FontAwesomeIcon icon={faDizzy} size="2x" />
    <code>{message}</code>
  </ErrorWrapper>
)

export default ErrorMessage
