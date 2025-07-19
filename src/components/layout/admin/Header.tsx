import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import ProfileDropdown from "./ProfileDropdown"
import ThemeSwitch from "./ThemeSwitch"
import { Separator } from "@/components/ui/separator"
import Breadcrumbs from "../Breadcrumbs"
import { useLocation } from "react-router"
import { paths } from "@/constants/paths"
import { useEffect, useState } from "react"

export default function Header() {
  const [offset, setOffset] = useState(0)

  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener("scroll", onScroll, { passive: true })

    return () => document.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "bg-background flex h-16 items-center gap-3 p-4 sm:gap-4",
        "sticky top-0 z-50 shrink-0 rounded-md",
        offset > 10 ? "shadow-sm" : "shadow-none",
      )}
    >
      <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
      {pathname !== paths.admin.home.getHref() && (
        <Separator orientation="vertical" className="!h-6" />
      )}
      {pathname !== paths.admin.home.getHref() && <Breadcrumbs />}
      <div className="ml-auto flex items-center space-x-4">
        <ThemeSwitch />
        <ProfileDropdown />
      </div>
    </header>
  )
}
