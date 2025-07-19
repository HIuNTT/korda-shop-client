import { Button, ButtonProps } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDisclosure } from "@/hooks/use-disclosure"
import { cn } from "@/lib/utils"
import { forwardRef, ReactNode, useImperativeHandle } from "react"

interface Props {
  title?: ReactNode
  description?: ReactNode
  body: ReactNode
  btnAcceptProps: ButtonProps
  className?: string
  cancelBtnText?: string
  showCloseButton?: boolean
}

export interface ConfirmDialogRef {
  onOpen: () => void
  onClose: () => void
}

const ConfirmDialog = forwardRef<ConfirmDialogRef, Props>(
  (
    {
      title = null,
      description = null,
      body,
      btnAcceptProps,
      className,
      cancelBtnText = "Hủy",
      showCloseButton = false,
    },
    ref,
  ) => {
    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()

    useImperativeHandle(
      ref,
      () => ({
        onOpen,
        onClose,
      }),
      [],
    )

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={showCloseButton} className={cn(className)}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {body}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="flex-1" disabled={btnAcceptProps.isLoading}>
                {cancelBtnText}
              </Button>
            </DialogClose>
            <Button {...btnAcceptProps} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
)

export default ConfirmDialog
