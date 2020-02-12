/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { unstable_batchedUpdates as batchUpdate } from 'react-dom'
import Web3 from 'web3'

interface UseWeb3SetupInterface {
  web3?: Web3
  error?: Error
}

const useWeb3Setup = (): UseWeb3SetupInterface => {
  const [web3, setWeb3] = useState<Web3>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (!window || !(window as any).web3) return

    async function load(): Promise<void> {
      try {
        await new Promise((accept, reject) => {
          if (!window) reject('No window')
          window.addEventListener('load', function answer(e) {
            window.removeEventListener('load', answer)
            accept(e)
          })
        })
        const web3 = new Web3((window as any).web3)
        if (typeof web3.currentProvider !== 'string') {
          // @ts-ignore
          await web3.currentProvider?.enable()
        }

        setWeb3(web3)
      } catch (error) {
        console.error(error)

        batchUpdate(() => {
          setWeb3(undefined)
          setError(new Error(error))
        })
      }
    }

    load()
  }, [error])

  return { web3, error }
}

export default useWeb3Setup
