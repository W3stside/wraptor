import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.footer`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  padding 1.3em;
  text-align: center;
  position: relative;
  color: var(--color-text-secondary);
  font-size: 0.85rem;

  ul {
    display: flex;
    list-style-type: none;
    justify-content: center;
    white-space: nowrap;
  }

  li {
    margin: 0 1rem;
    a {
      color: var(--color-text-secondary);
    }
  }

  ul, .version {
    margin-left: auto;
  }

  .version {
    font-size: 0.85em;
  }
`

const Footer: React.FC = () => (
  <Wrapper>
    <ul>
      <li>About</li>
      <li>Some Other Links</li>
    </ul>
    <div className="version">App Version: {VERSION}</div>
  </Wrapper>
)

export default Footer
