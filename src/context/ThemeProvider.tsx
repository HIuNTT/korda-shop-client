import { createContext, PropsWithChildren, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

type ThemeProviderProps = {
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeContextState = {
  theme: Theme
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

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"

      root.style.setProperty("color-scheme", systemTheme)
      root.classList.add(systemTheme)
      return
    }

    root.style.setProperty("color-scheme", theme)
    root.classList.add(theme)
  }, [theme])

  const value: ThemeContextState = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}
