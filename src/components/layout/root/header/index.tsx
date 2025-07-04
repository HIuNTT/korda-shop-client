import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LayoutGrid } from "lucide-react"
import { Link } from "react-router"
import Search from "./Search"
import { paths } from "@/constants/paths"
import AuthMenu from "./AuthMenu"
import ThemeToggle from "./ThemeToggle"

export default function Header() {
  return (
    <div className="bg-background border-border ease-out-quint sticky top-0 z-50 border-b transition-colors duration-200">
      <div className="mx-auto h-16 w-full max-w-300 py-3">
        <div className="flex justify-between gap-4 max-[1200px]:px-4">
          <div className="flex items-center gap-4">
            <Link to={paths.home.path}>
              <div className="font-chewy text-primary text-4xl select-none">KorDa</div>
            </Link>
            <Button variant="ghost" startContent={<LayoutGrid />}>
              Danh mục
            </Button>
          </div>
          <Search />
          <div className="flex items-center gap-1">
            <AuthMenu />
            <Separator className="!h-6" orientation="vertical" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
