import { AssertionError } from 'assert'

export function assert<T>(val: T, message: string): asserts val is NonNullable<T> {
  if (!val) {
    throw new AssertionError({ message })
  }
}

// eslint-disable-next-line
function noop(..._args: any[]): void {}

export const log = process.env.NODE_ENV === 'test' ? noop : console.log
