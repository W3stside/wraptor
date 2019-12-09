import { useEffect, useState } from 'react'

export default (): boolean => {
  const [web3Loaded, setWeb3Loaded] = useState(false)
  useEffect(() => {
    const windowLoad = async (): Promise<string> =>
      new Promise((accept, reject) => {
        if (!window) reject('No window')
        window.addEventListener('load', function listener() {
          window.removeEventListener('load', listener)
          return accept('Window loaded')
        })
      })
    windowLoad()
      .then(() => setWeb3Loaded(true))
      .catch(() => setWeb3Loaded(false))
  }, [])

  return web3Loaded
}