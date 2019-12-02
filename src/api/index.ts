import ExampleApi from './example/ExampleApi'
import ExampleApiMock from './example/ExampleApiMock'

import { ExampleApiInterface } from 'types'

const isExampleMock = process.env.MOCK_EXAMPLE === 'true'

function createExampleAPI(): ExampleApiInterface {
  let exampleApi
  if (isExampleMock) {
    exampleApi = new ExampleApiMock({ name: 'DaveMock', age: 27, id: 123 })
  } else {
    exampleApi = new ExampleApi({ name: 'Dave', age: 27, id: 123 })
  }
  window['exampleApi'] = exampleApi // register for convenience
  return exampleApi
}

// Build APIs
export const exampleApi: ExampleApiInterface = createExampleAPI()
