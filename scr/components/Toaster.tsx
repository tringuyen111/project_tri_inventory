import { Toaster as Sonner } from "sonner@2.0.3"
import { useTheme } from "../contexts/ThemeContext"

export function Toaster() {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      } as React.CSSProperties}
    />
  )
}