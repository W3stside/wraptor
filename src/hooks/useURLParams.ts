import { useEffect } from 'react'
import { useHistory } from 'react-router'

/* WHAT IS THIS? */
// useURLParams deals with search params and sets URL on change

function useURLParams(newParams?: string): void {
  const history = useHistory()

  useEffect(() => {
    if (newParams) {
      history.push(newParams)
    }
  }, [history, newParams])
}

export default useURLParams
