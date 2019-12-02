import React, { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  background-color: lightyellow;
  cursor: pointer;

  font-size: 80%;

  @media only screen and (max-width: 500px) {
    padding: 0.2rem 2rem;
  }
`

const Text = styled.p`
  animation-name: foldAnimation;
  animation-duration: 1.5s;

  @keyframes foldAnimation {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

interface AppBannerProps {
  startOpen: boolean
  title: string
}

const BannerInnerText: React.FC = () => <Text>Some Banner Text cause why not</Text>

const AppBanners: React.FC<AppBannerProps> = ({ startOpen, title }) => {
  const [open, setOpen] = useState(startOpen)

  const openCloseDisclaimer = (): void => setOpen(!open)

  return (
    <Wrapper onClick={openCloseDisclaimer}>
      <h3>{title}</h3>
      {open && <BannerInnerText />}
    </Wrapper>
  )
}

export default AppBanners
