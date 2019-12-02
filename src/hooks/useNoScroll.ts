import { useEffect } from 'react'

/* WHAT IS THIS? */
// useNoScroll sets a no-scroll type CSS change on body via overflow: hidden
// Useful for apps that require a non-scrolling behaviour when modals are present

const useNoScroll = (scrollCondition: boolean): void => {
  useEffect((): (() => void) | void => {
    if (typeof document === 'undefined') return

    const noScrollActive = document.body.classList.contains('noScroll')

    if (noScrollActive && !scrollCondition) {
      document.body.classList.remove('noScroll')
    } else if (!noScrollActive && scrollCondition) {
      document.body.classList.add('noScroll')
    }

    return (): void => document.body.classList.remove('noScroll')
  }, [scrollCondition])
}

export default useNoScroll
