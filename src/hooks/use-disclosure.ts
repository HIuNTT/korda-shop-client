import { useCallback, useState } from "react"

export interface UseDisclosureProps {
  defaultOpen?: boolean
}

export function useDisclosure({ defaultOpen }: UseDisclosureProps = {}) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen || false)

  const onOpen = useCallback(() => setIsOpen(true), [])

  const onClose = useCallback(() => setIsOpen(false), [])

  const onOpenChange = useCallback(() => {
    const action = isOpen ? onClose : onOpen
    action()
  }, [isOpen, onClose, onOpen])

  return {
    isOpen: !!isOpen,
    onOpen,
    onClose,
    onOpenChange,
  }
}

export type UseDisclosureReturn = ReturnType<typeof useDisclosure>
