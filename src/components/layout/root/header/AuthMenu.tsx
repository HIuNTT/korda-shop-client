import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDisclosure } from "@/hooks/use-disclosure"
import LoginDialog from "@/modules/auth/components/LoginDialogl"
import { CircleUser } from "lucide-react"
import { useCallback, useRef, useState } from "react"

export default function AuthMenu() {
  console.log("AuthMenu")

  const [open, setOpen] = useState(false)

  const disclosureLogin = useDisclosure()

  console.log("open:", open)

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

  return (
    <>
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            isIconOnly
            className="size-10 [&_svg:not([class*='size-'])]:size-4.5 [&:has(>div>i)>div]:size-4.5"
            onPointerEnter={handleOpen}
            onPointerLeave={handleClose}
          >
            <CircleUser />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40"
          onPointerEnter={handleOpen}
          onPointerLeave={handleClose}
        >
          <DropdownMenuItem onClick={() => disclosureLogin.onOpen()}>Đăng nhập</DropdownMenuItem>
          <DropdownMenuItem>Đăng ký</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={disclosureLogin.isOpen} onOpenChange={disclosureLogin.onOpenChange}>
        <LoginDialog onClose={disclosureLogin.onClose} />
      </Dialog>
    </>
  )
}
