import { useCallback, useLayoutEffect, useState } from "react"

interface Props {
  targetRef: React.RefObject<HTMLElement | null>
}

interface Position {
  top: number
  left: number
  width: number
  height: number
  bottom: number
}

export function usePosition({ targetRef }: Props) {
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    bottom: 0,
  })

  const updatePosition = useCallback(() => {
    if (!targetRef.current) return

    const rect = targetRef.current.getBoundingClientRect()
    const position = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
    }
    setPosition(position)
  }, [targetRef])

  useLayoutEffect(() => {
    updatePosition()
    window.addEventListener("scroll", updatePosition)
    window.addEventListener("resize", updatePosition)

    return () => {
      window.removeEventListener("scroll", updatePosition)
      window.removeEventListener("resize", updatePosition)
    }
  }, [updatePosition])

  return position
}
