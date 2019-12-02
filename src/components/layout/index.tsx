import React from 'react'
import styled from 'styled-components'

import Header from './Header'
import Footer from './Footer'
import AppBanner from '../AppBanner'

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;

  display: grid;
  grid-template-rows: auto;

  main {
    flex: 1;
    margin: auto;
    min-width: 40vw;

    @media only screen and (max-width: 768px) {
      width: 100%;
    }
  }
`

const Layout: React.FC = ({ children }) => (
  <Wrapper>
    <AppBanner startOpen={false} title={'Hi this is a banner'} />
    <Header />
    <main>{children}</main>
    <Footer />
  </Wrapper>
)

export default Layout
