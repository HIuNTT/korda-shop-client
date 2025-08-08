import { createContext, PropsWithChildren, useCallback, useEffect, useState } from "react"

const MEDIA = "(prefers-color-scheme: dark)"

type Theme = "light" | "dark" | "system"

type ThemeProviderProps = {
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeContextState = {
  theme: Theme
  resolvedTheme?: Omit<Theme, "system">
  setTheme: (theme: Theme) => void
}

const initialState: ThemeContextState = {
  theme: "system",
  setTheme: () => null,
}

export const ThemeProviderContext = createContext<ThemeContextState>(initialState)

export default function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}: PropsWithChildren<ThemeProviderProps>) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  )
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    theme === "system" ? getSystemTheme() : theme,
  )

  const applyTheme = useCallback((theme: Theme) => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = getSystemTheme()

      root.style.setProperty("color-scheme", systemTheme)
      root.classList.add(systemTheme)
      return
    }

    root.style.setProperty("color-scheme", theme)
    root.classList.add(theme)
  }, [])

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e)
      setResolvedTheme(resolved)

      if (theme === "system") {
        applyTheme("system")
      }
    },
    [theme],
  )

  useEffect(() => {
    const media = window.matchMedia(MEDIA)

    media.addEventListener("change", handleMediaQuery)
    handleMediaQuery(media)

    return () => media.removeEventListener("change", handleMediaQuery)
  }, [handleMediaQuery])

  // localStorage event handling
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return

      if (!e.newValue) {
        setTheme(defaultTheme)
      } else {
        setTheme(e.newValue as Theme)
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const value: ThemeContextState = {
    theme,
    resolvedTheme: theme === "system" ? resolvedTheme : theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent) => {
  if (!e) e = window.matchMedia(MEDIA)
  const isDark = e.matches
  return isDark ? "dark" : "light"
}
