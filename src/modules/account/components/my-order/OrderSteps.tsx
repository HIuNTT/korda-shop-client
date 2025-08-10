import { cn } from "@/lib/utils"
import { ElementType } from "react"

export interface Step {
  title: string
  icon: ElementType
  subTitle?: string
  status?: "process" | "finish" | "wait"
}

interface Props {
  items: Step[]
}

export default function OrderSteps({ items }: Props) {
  return (
    <div className="flex w-full">
      {items.map((item, index) => (
        <div className="flex-1" key={index}>
          <div className="flex justify-center overflow-hidden">
            <div
              className={cn(
                "bg-background border-success-6 text-success-6 relative flex size-15 items-center justify-center rounded-full border-4",
                item.status === "process" && "bg-success-6 text-background after:translate-x-1",
                item.status === "wait" && "border-content-4 text-content-4",
                index !== 0 &&
                  item.status !== "wait" &&
                  "before:bg-success-6 before:absolute before:end-full before:h-1 before:w-[9999px]",
                index !== items.length - 1 &&
                  item.status === "finish" &&
                  "after:bg-success-6 after:absolute after:start-full after:h-[4px] after:w-[9999px] after:content-['']",
                index !== items.length - 1 &&
                  item.status !== "finish" &&
                  "after:bg-content-4 after:absolute after:start-full after:h-1 after:w-[9999px]",
                index !== 0 &&
                  item.status === "wait" &&
                  "before:bg-content-4 before:absolute before:end-full before:h-1 before:w-[9999px]",
              )}
            >
              <item.icon size={30} />
            </div>
          </div>
          <div className="mt-5 mb-1 text-center text-sm capitalize">{item.title}</div>
          {item.subTitle && (
            <div className="text-muted-foreground text-center text-xs capitalize">
              {item.subTitle}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
