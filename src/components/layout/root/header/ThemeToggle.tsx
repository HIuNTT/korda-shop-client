import { Button } from "@/components/ui/button"
import { useTheme } from "@/stores/theme"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      isIconOnly
      className="size-10 transition-none [&_svg:not([class*='size-'])]:size-4.5 [&:has(>div>i)>div]:size-4.5"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle Theme"
      title="Toggle Theme"
    >
      {resolvedTheme === "light" && <Sun />}
      {resolvedTheme === "dark" && <Moon />}
    </Button>
  )
}
