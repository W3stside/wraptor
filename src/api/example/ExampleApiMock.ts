import { ExampleApiInterface } from 'types'

interface Constructor {
  name: string
  id: number
  age: string | number
}

/**
 * Basic implementation of Wallet API
 */
export class ExampleApi implements ExampleApiInterface {
  private _name: string
  private _id: number
  private _age: string | number

  public constructor({ name, id, age }: Constructor) {
    this._name = name
    this._id = id
    this._age = age
  }

  public somePublicMethod(): string {
    return `Name: ${this._name} & ID: ${this._id} & Age: ${this._age}`
  }

  public someOtherPublicMethodCallingGetter(): string {
    return this._somePrivateGetter
  }

  /* ****************      Private Functions      **************** */
  private get _somePrivateGetter(): string {
    return 'private getter string'
  }
}

export default ExampleApi
