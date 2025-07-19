import { Button } from "@/components/ui/button"
import { usePosition } from "@/hooks/use-position"
import { cn } from "@/lib/utils"
import { RefObject } from "react"

interface Props {
  targetRef: RefObject<HTMLElement | null>
  isLoading?: boolean
}

export default function CreateFormFooter({ targetRef, isLoading = false }: Props) {
  const { left, width, bottom } = usePosition({ targetRef })

  const isFixedBottom = bottom + 88 > window.innerHeight

  return (
    <div>
      <div
        className={cn(
          "m-auto flex items-center justify-end gap-4 rounded-t-md p-6",
          isFixedBottom &&
            "bg-card fixed bottom-0 z-50 shadow-[0_-2px_6px_0_rgba(0,0,0,0.12)] dark:shadow-[0_-2px_6px_0_rgba(255,255,255,0.12)]",
        )}
        style={{ left, width }}
      >
        <Button type="button" variant="outline" className="min-w-22">
          Hủy
        </Button>
        <Button type="submit" className="min-w-22" isLoading={isLoading}>
          Lưu
        </Button>
      </div>
      <div className={cn(!isFixedBottom && "hidden", isFixedBottom && "h-[88px]")}></div>
    </div>
  )
}
