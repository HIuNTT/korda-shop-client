import { useEffect, useRef, useState } from "react"

/**
 *
 * @param duration: number - Duration in seconds
 * @returns
 */
export function useCountdown(duration: number) {
  const [timeLeft, setTimeLeft] = useState<number>(duration)
  const [isRunning, setIsRunning] = useState<boolean>(true)

  const countdownRef = useRef<ReturnType<typeof window.setInterval> | null>(null)

  const restart = () => {
    setTimeLeft(duration)
    setIsRunning(true)
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
  }

  const stop = () => {
    setIsRunning(false)
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
  }

  useEffect(() => {
    if (!isRunning) return

    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          stop()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
        countdownRef.current = null
      }
    }
  }, [isRunning])

  return {
    seconds: timeLeft,
    isRunning,
    onStop: stop,
    onRestart: restart,
  }
}
