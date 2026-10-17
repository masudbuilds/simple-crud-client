import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import Script from "next/script"

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Script id="theme-initializer" strategy="beforeInteractive">
          {`(() => {
            let theme = "system"
            try {
              theme = localStorage.getItem("theme") || "system"
            } catch (error) {
              console.warn("Unable to read the saved theme preference.", error)
            }
            const dark = theme === "dark" || (
              theme !== "light" &&
              window.matchMedia("(prefers-color-scheme: dark)").matches
            )
            const root = document.documentElement
            root.classList.remove("light", "dark")
            root.classList.add(dark ? "dark" : "light")
          })()`}
        </Script>
      </body>
    </html>
  )
}
