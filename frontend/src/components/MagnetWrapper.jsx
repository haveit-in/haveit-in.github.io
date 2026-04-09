import { useEffect, useRef } from 'react'

export default function MagnetWrapper({ children, className = '', maxTranslate = 10, scale = 1.03, ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let frameId = null

    const resetTransform = () => {
      if (element) {
        element.style.transform = ''
      }
    }

    const handlePointerMove = (event) => {
      if (!element) return
      const rect = element.getBoundingClientRect()
      const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
      const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
      const translateX = Math.round(x * maxTranslate)
      const translateY = Math.round(y * maxTranslate)

      if (frameId) {
        cancelAnimationFrame(frameId)
      }
      frameId = requestAnimationFrame(() => {
        if (element) {
          element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`
        }
      })
    }

    element.addEventListener('pointermove', handlePointerMove)
    element.addEventListener('pointerleave', resetTransform)
    element.addEventListener('pointercancel', resetTransform)

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
      element.removeEventListener('pointermove', handlePointerMove)
      element.removeEventListener('pointerleave', resetTransform)
      element.removeEventListener('pointercancel', resetTransform)
    }
  }, [maxTranslate, scale])

  return (
    <div
      ref={ref}
      className={`inline-block will-change-transform transition-transform duration-200 ease-out ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
