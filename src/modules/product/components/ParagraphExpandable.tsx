import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"
import { PropsWithChildren, useState } from "react"

export default function ParagraphExpandable({ children }: PropsWithChildren) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClick = () => {
    isExpanded &&
      document.querySelector("#cpsContent")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    setIsExpanded((prev) => !prev)
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ maxHeight: !isExpanded ? "567px" : undefined }}
    >
      {children}
      <div
        className={cn(
          "rounded-b-xl text-center",
          !isExpanded &&
            "absolute right-0 bottom-0 left-0 pt-10 [background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.91)_50%,rgba(255,255,255,1)_55%)] dark:[background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.91)_50%,rgba(0,0,0,1)_55%)]",
        )}
      >
        <div
          onClick={handleClick}
          className="text-blue-6 mx-auto inline-flex cursor-pointer items-center justify-center gap-2 p-3 text-sm"
        >
          {isExpanded ? "Thu gọn" : "Xem thêm"}
          <span>
            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </span>
        </div>
      </div>
    </div>
  )
}
