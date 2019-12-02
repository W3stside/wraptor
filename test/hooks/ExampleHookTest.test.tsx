import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'

// import { someHook } from 'hooks'

const TestScrollComponent: React.FC = () => {
  // someHook(foo)

  const bar = 'hi'

  return (
    <div>
      <h1>{bar || ''}</h1>
    </div>
  )
}

let container: HTMLDivElement | null

// before each test suite
beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

// After each test suite
afterEach(() => {
  document.body.removeChild(container as HTMLDivElement)
  container = null
})

describe('Some hook test suite using Act React testing tools', () => {
  it('Does some testing stuff', () => {
    // Test first render and effect
    act(() => {
      ReactDOM.render(<TestScrollComponent />, container)
    })

    act(() => {
      // Do something in React ACT scope (event firings, mounting, updates)
    })

    act(() => {
      ReactDOM.render(<TestScrollComponent />, container)
    })

    expect(true).toBe(true)
  })
})
