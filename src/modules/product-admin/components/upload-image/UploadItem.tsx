import { useSortable } from "@dnd-kit/sortable"
import { UploadFile } from "."
import { CSSProperties } from "react"
import { CSS } from "@dnd-kit/utilities"
import WrapperItem from "./WrapperItem"
import Item from "./Item"

interface UploadItemProps {
  file: UploadFile
  onRemove: (file: UploadFile) => void
}

export default function UploadItem({ file, onRemove }: UploadItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.uid,
    disabled: file.status !== "done",
  })
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  }
  return (
    <WrapperItem ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item file={file} onRemove={onRemove} isDragging={isDragging} />
    </WrapperItem>
  )
}
