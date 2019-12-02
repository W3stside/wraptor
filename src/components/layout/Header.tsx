import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'

import styled from 'styled-components'
import { rem } from 'polished'

const Wrapper = styled.header`
  color: #ffffff;
  background-color: #3340a9;
  min-height: ${rem('325px')};

  nav {
    display: flex;
    align-items: center;
    flex-flow: row wrap;

    @media only screen and (max-width: 866px) {
      justify-content: center;
    }
  }

  .nav-links {
    display: flex;
    flex: 3;
    justify-content: center;
    padding: 0;
    list-style-type: none;
    white-space: nowrap;

    a {
      color: white;
      padding: 0.8em;
    }

    @media only screen and (max-width: 866px) {
      flex: 1 1 100%;
      order: 2;
    }
  }

  .logo {
    flex: 1;
    border: 2px solid #ff5097;
    color: #ff5097;
    text-align: center;
    vertical-align: middle;

    &:hover {
      color: white;
      border-color: white;
      cursor: pointer;
    }
  }

  .nav-links,
  .logo {
    padding: 1rem;
    margin: 1rem;
  }

  .header-title {
    margin: 0 auto;
    line-height: 1.15;
    text-align: center;
    width: 95%;
  }

  h1 {
    margin-bottom: 0;
  }
  h3 {
    margin-top: 0;
    color: #e0aacf;
  }

  @media only screen and (max-width: 500px) {
    .logo,
    .nav-links,
    .nav-links {
      margin: 0 auto;
    }

    .header-title {
      margin-bottom: 2rem;
      h1 {
        font-size: 1.8rem;
      }
      h3 {
        font-size: 1rem;
      }
    }
  }
`

const Header: React.FC = () => {
  const location = useLocation()

  const { from } = location.state || { from: { pathname: '/' } }

  return (
    <Wrapper>
      <nav>
        <Link className="logo" to="/">
          App Logo and Link
        </Link>
        <ul className="nav-links">
          <li>
            <Link to={from.pathname}>Somewhere 1</Link>
          </li>
          <li>
            <Link to={{ pathname: '/', state: { from: location } }}>Somewhere 2</Link>
          </li>
        </ul>
      </nav>
      <div className="header-title">
        <h1>Example App</h1>
        <h3>Subtitle</h3>
      </div>
    </Wrapper>
  )
}

export default Header
