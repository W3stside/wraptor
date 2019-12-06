import styled, { CSSObject } from 'styled-components'

export const FlexContainer = styled.div<{
  flow?: string
  justify?: string
  align?: string
  width?: string
  margin?: string
  customStyle?: CSSObject
}>`
  display: flex;
  flex-flow: ${(props): string => props.flow || 'column nowrap'};
  align-items: ${(props): string => props.align || 'center'};
  justify-content: ${(props): string => props.justify || 'center'};
  margin: ${(props): string => props.margin || 'auto'};
  width: ${(props): string => props.width || '100%'};
  ${(props): CSSObject | null => props.customStyle || null}
`

export const WraptorContainer = styled(FlexContainer)`
  width: auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 3px 4px 2px -1px #0000000f;
  padding: 20px;
`

export const WraptorCode = styled.code`
  flex: 1 1 49%;
  padding: 0.65em;
  margin: 0.4em 0.85em;
  font-size: 0.85rem;
  text-align: center;
`

export const WraptorInput = styled.input`
  flex: 1 1 49%;
  width: 100%;

  background: #dededead;
  border: none;
  border-radius: 10px;
  box-shadow: 3px 4px 2px -1px #00000038;
  outline: none;
  text-align: center;
  transition: background 0.3s ease-in-out;

  &:focus {
    background: #cf94e357;
  }
`

export const WraptorButton = styled.button<{ cursorDisabled?: boolean; customStyle?: CSSObject }>`
  flex: 1 1 40%;

  color: #fff;
  background: #9b8dfa;
  border: none;
  border-radius: 2px;
  cursor: ${(props): string => (props.cursorDisabled ? 'not-allowed' : 'pointer')};

  padding: 0.5rem;
  margin: 0.5rem;
  min-width: 133px;

  transition: background 0.3s ease-in-out;

  &:disabled,
  &[disabled] {
    background-color: rgba(187, 187, 187, 0.3);
    color: #00000033;

    pointer-events: none;
  }

  :hover {
    background: #7460f8;
    color: #fff;
  }

  &.big {
    font-size: 1.2em;
    padding: 0.65em 1em;
  }

  &.small {
    font-size: 0.6em;
    padding: 0.3em 0.5em;
  }

  ${(props): CSSObject | null => props.customStyle || null};
`

export const ErrorWrapper = styled.div`
  position: relative;
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

export const ErrorCloseWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000000ad;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease-in-out;

  > div {
    display: inline-flex;
    margin: auto;
    border-radius: 30px;
    border: 3px solid white;
    padding: 5px 10px;
    color: white;
    font-weight: 900;

    &::hover {
      opacity: 1;
    }
  }
`
