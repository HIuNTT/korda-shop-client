import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/stores/user"
import { LogOut, Settings } from "lucide-react"
import { Link } from "react-router"

export default function ProfileDropdown() {
  const { user } = useUser()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-8 rounded-full">
          <Avatar className="size-8">
            <AvatarImage src={user.profile.avatar_url} alt={user.profile.full_name} />
            <AvatarFallback>
              {user.profile.full_name.split(" ").reverse()[0].charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-56" align="end" forceMount>
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left">
            <Avatar className="size-8">
              <AvatarImage src={user.profile.avatar_url} alt={user.profile.full_name} />
              <AvatarFallback>
                {user.profile.full_name.split(" ").reverse()[0].charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid text-left leading-tight">
              <span className="truncate font-semibold">{user.profile.full_name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/settings">
              <Settings />
              Cài đặt
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <div>
            <LogOut />
            Đăng xuất
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
