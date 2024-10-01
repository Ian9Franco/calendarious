'use client'

import { useEffect } from 'react'

export default function MouseTracker() {
  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      document.body.style.setProperty('--mouse-x', `${ev.clientX}px`)
      document.body.style.setProperty('--mouse-y', `${ev.clientY}px`)
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  return null
}