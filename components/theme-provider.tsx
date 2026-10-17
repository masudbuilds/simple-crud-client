"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = Exclude<Theme, "system">

let themeOverride: Theme | null = null

function getThemeSnapshot(): Theme {
  if (themeOverride !== null) {
    return themeOverride
  }

  try {
    const storedTheme = window.localStorage.getItem("theme")
    return storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
      ? storedTheme
      : "system"
  } catch (error) {
    console.warn("Unable to read the saved theme preference.", error)
    return "system"
  }
}

function subscribeToTheme(onChange: () => void) {
  function onStorage() {
    themeOverride = null
    onChange()
  }

  window.addEventListener("storage", onStorage)
  window.addEventListener("theme-change", onChange)
  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener("theme-change", onChange)
  }
}

function subscribeToSystemTheme(onChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  mediaQuery.addEventListener("change", onChange)
  return () => mediaQuery.removeEventListener("change", onChange)
}

function getSystemThemeSnapshot(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: ResolvedTheme) {
  const style = document.createElement("style")
  style.textContent =
    "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
  document.head.appendChild(style)

  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(theme)
  window.getComputedStyle(document.body)
  window.setTimeout(() => document.head.removeChild(style), 1)
}

const ThemeContext = React.createContext<{
  resolvedTheme: ResolvedTheme | undefined
  setTheme: (theme: Theme) => void
} | null>(null)

function ThemeProvider({ children }: React.PropsWithChildren) {
  const theme = React.useSyncExternalStore<Theme | null>(
    subscribeToTheme,
    getThemeSnapshot,
    (): Theme | null => null,
  )
  const systemTheme = React.useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemThemeSnapshot,
    (): ResolvedTheme => "light",
  )
  const resolvedTheme: ResolvedTheme | undefined =
    theme === null ? undefined : theme === "system" ? systemTheme : theme

  const setTheme = React.useCallback((nextTheme: Theme) => {
    themeOverride = nextTheme
    try {
      window.localStorage.setItem("theme", nextTheme)
    } catch (error) {
      console.warn("Unable to save the theme preference.", error)
    }
    window.dispatchEvent(new Event("theme-change"))
  }, [])

  React.useEffect(() => {
    if (resolvedTheme === undefined) {
      return
    }

    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  return (
    <ThemeContext.Provider value={{ resolvedTheme, setTheme }}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const theme = React.useContext(ThemeContext)

  if (!theme) {
    throw new Error("ThemeHotkey must be used within ThemeProvider.")
  }

  const { resolvedTheme, setTheme } = theme

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      if (resolvedTheme) {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }
