import { ComponentProps } from "react"
import UploadItem from "./UploadItem"
import { CircleAlertIcon, Eye, Trash } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export default function Item({
  file,
  onRemove,
  isDragging = true,
}: ComponentProps<typeof UploadItem> & { isDragging?: boolean }) {
  return (
    <div
      className="group relative h-full cursor-grab rounded-sm data-[draggable=false]:cursor-default data-[draggable=false]:select-none data-[dragging=true]:cursor-grabbing"
      data-dragging={isDragging}
      data-draggable={file.status !== "done" ? "false" : undefined}
      style={{ paddingTop: "100%" }}
    >
      {file.status === "done" && (
        <img
          src={file.url}
          alt={file.name}
          title={file.name}
          className="bg-card absolute top-0 left-0 h-[inherit] w-full rounded-sm border object-contain"
        />
      )}
      {file.status === "error" && (
        <div className="text-destructive bg-accent absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center gap-1 rounded-sm border select-none">
          <CircleAlertIcon className="size-4" />
          <span className="text-center text-xs leading-3.5">
            Tải lên <br /> thất bại
          </span>
        </div>
      )}
      {file.status === "uploading" && (
        <div className="bg-accent absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-sm">
          <Spinner size="sm" />
        </div>
      )}
      {file.status !== "uploading" && (
        <div className="bg-accent-foreground/40 text-primary-foreground absolute right-0 bottom-0 left-0 flex h-6 items-center justify-center gap-4 rounded-b-sm border border-t-transparent opacity-0 transition-all duration-300 group-hover:opacity-100">
          {file.status === "done" && (
            <span className="cursor-pointer">
              <Eye className="size-4" />
            </span>
          )}
          <span data-no-dnd="true" className="cursor-pointer" onClick={() => onRemove(file)}>
            <Trash className="size-4" />
          </span>
        </div>
      )}
    </div>
  )
}
