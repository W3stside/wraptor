import { useEffect, useState } from 'react'

export default (intervalTime: number = 5000) => {
    const [intervalChange, setIntervalChange] = useState(0)
  
    useEffect(() => {
      const interval = setInterval(() => setIntervalChange(intervalChange + 5), intervalTime)
  
      return () => clearInterval(interval)
    }, [intervalChange, intervalTime])
  
    return intervalChange
}
