import { Button } from "@/components/ui/button"
import { useTheme } from "@/stores/theme"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      isIconOnly
      className="size-10 transition-none [&_svg:not([class*='size-'])]:size-4.5 [&:has(>div>i)>div]:size-4.5"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle Theme"
      title="Toggle Theme"
    >
      {theme === "light" && <Sun />}
      {theme === "dark" && <Moon />}
    </Button>
  )
}
