import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDisclosure } from "@/hooks/use-disclosure"
import LoginDialog from "@/modules/auth/components/LoginDialogl"
import SignUpDialog from "@/modules/auth/components/sign-up"
import { useUser } from "@/stores/user"
import { ChevronDown, CircleUser, LogOut } from "lucide-react"
import { LuUserRound } from "react-icons/lu"
import { CgNotes } from "react-icons/cg"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useGetProfile } from "@/modules/user/services/getProfile"
import { Skeleton } from "@/components/ui/skeleton"
import { useLogout } from "@/modules/auth/services/logout"
import { queryClient } from "@/configs/queryClient"

export default function AuthMenu() {
  const [open, setOpen] = useState(false)

  const {
    auth,
    user,
    user: { profile },
    setUser,
    clear,
  } = useUser()

  const getProfile = useGetProfile(!!auth.access_token && !user.email)
  const logout = useLogout()

  const disclosureLogin = useDisclosure()
  const disclosureSignUp = useDisclosure()

  const openTimerRef = useRef(0)
  const closeTimerRef = useRef(0)

  const handleOpen = useCallback(() => {
    clearTimeout(closeTimerRef.current)
    openTimerRef.current = window.setTimeout(() => {
      setOpen(true)
    }, 100)
  }, [setOpen])

  const handleClose = useCallback(() => {
    clearTimeout(openTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false)
    }, 100)
  }, [setOpen])

  const handleLogout = () => {
    logout.mutate(
      { refresh_token: auth.refresh_token },
      {
        onSuccess: () => {
          queryClient.clear()
          clear()
        },
        onError: () => clear(),
      },
    )
  }

  useEffect(() => {
    if (getProfile.data) {
      setUser(getProfile.data)
    }

    if (getProfile.isError) {
      clear()
    }
  }, [getProfile.data, getProfile.isError, setUser, clear])

  return (
    <>
      {!auth.access_token ? (
        <Button
          variant="ghost"
          size="icon"
          isIconOnly
          className="size-10 [&_svg:not([class*='size-'])]:size-4.5 [&:has(>div>i)>div]:size-4.5"
          onClick={disclosureLogin.onOpen}
        >
          <CircleUser />
        </Button>
      ) : !user.email && getProfile.isFetching ? (
        <div className="mr-4 flex items-center space-x-3">
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
      ) : (
        <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              onPointerEnter={handleOpen}
              onPointerLeave={handleClose}
              className="px-4"
              startContent={
                <Avatar className="size-7">
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                  <AvatarFallback>
                    <LuUserRound size={16} />
                  </AvatarFallback>
                </Avatar>
              }
              endContent={
                <ChevronDown className={cn("ease-out-quint transition", { "rotate-180": open })} />
              }
            >
              {profile.full_name.split(" ").pop()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[240px] min-w-max"
            onPointerEnter={handleOpen}
            onPointerLeave={handleClose}
          >
            <DropdownMenuItem asChild>
              <Button
                className="w-full justify-start !px-3 focus-visible:ring-0"
                variant="ghost"
                size="lg"
                startContent={<CircleUser className="size-5" />}
              >
                Thông tin tài khoản
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                type="button"
                className="w-full justify-start !px-3 focus-visible:ring-0"
                variant="ghost"
                size="lg"
                startContent={<CgNotes className="size-5" />}
              >
                Đơn hàng
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" asChild onClick={handleLogout}>
              <Button
                className="w-full justify-start !px-3 focus-visible:ring-0"
                variant="ghost"
                size="lg"
                startContent={<LogOut className="size-5" />}
              >
                Đăng xuất
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Dialog open={disclosureLogin.isOpen} onOpenChange={disclosureLogin.onOpenChange}>
        <LoginDialog onClose={disclosureLogin.onClose} onOpenSignUp={disclosureSignUp.onOpen} />
      </Dialog>

      <Dialog open={disclosureSignUp.isOpen} onOpenChange={disclosureSignUp.onOpenChange}>
        <SignUpDialog onClose={disclosureSignUp.onClose} onOpenLogin={disclosureLogin.onOpen} />
      </Dialog>
    </>
  )
}
