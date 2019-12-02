import { useEffect, useState } from 'react'

/* WHAT IS THIS? */
// useWindowSizes deals with window.innerWidth and .innerHeight and returns sizes
// Useful for dealing with responsive design changes that are difficult in pure CSS

interface WindowSizes {
  innerWidth?: number
  innerHeight?: number
}

function getSize(): WindowSizes {
  const isClient = typeof window === 'object'
  return {
    innerWidth: isClient ? window.innerWidth : undefined,
    innerHeight: isClient ? window.innerHeight : undefined,
  }
}

const useWindowSizes = (): WindowSizes => {
  const [innerWindowSpecs, setInnerWindowSpecs] = useState(getSize)

  function handleResize(): void | number {
    // check that client can handle this sexiness
    const { innerWidth, innerHeight } = getSize()

    return setInnerWindowSpecs({ innerWidth, innerHeight })
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return (): void => window.removeEventListener('resize', handleResize)
  }, [])

  return innerWindowSpecs
}

export default useWindowSizes
