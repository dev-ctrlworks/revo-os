"use client"

import { useEffect, useRef } from "react"

export function usePreserveScroll(active: boolean) {
  const savedRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return

    savedRef.current = window.scrollY

    let raf = 0
    let frames = 0

    const tick = () => {
      frames += 1
      const saved = savedRef.current
      if (saved != null && Math.abs(window.scrollY - saved) > 2) {
        window.scrollTo(0, saved)
      }
      if (frames < 45 && savedRef.current != null) {
        raf = requestAnimationFrame(tick)
      } else {
        savedRef.current = null
      }
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      const saved = savedRef.current
      savedRef.current = null
      if (saved != null) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, saved)
          })
        })
      }
    }
  }, [active])
}