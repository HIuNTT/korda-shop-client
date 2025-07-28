import useUpload, { RdFile } from "@/hooks/use-upload"
import { AxiosResponse } from "axios"
import { ImagePlus } from "lucide-react"
import { MouseEvent, PointerEvent, TouchEvent, useEffect, useMemo, useState } from "react"
import { createPortal, flushSync } from "react-dom"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  MouseSensorOptions,
  PointerSensor,
  PointerSensorOptions,
  TouchSensor,
  TouchSensorOptions,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import UploadItem from "./UploadItem"
import Item from "./Item"
import { cn } from "@/lib/utils"

type UploadFileStatus = "uploading" | "done" | "error" | "removed"

export interface UploadFile {
  uid: string
  name: string
  key?: string
  url?: string
  status?: UploadFileStatus
  error?: any
}

interface UploadResponse {
  url: string
  key: string
}

export interface UploadImageProps {
  maxFiles?: number
  multiple?: boolean
  maxSize?: number // in MB, default is 2MB
  onChange?: (value: Partial<UploadFile>[] | Partial<UploadFile>) => void
  value?: Partial<UploadFile>[] | Partial<UploadFile>
  showUploadTitle?: boolean
  className?: HTMLDivElement["className"]
  wrapperClass?: HTMLDivElement["className"]
  disabled?: boolean
}

function toObjectFile(file: Partial<UploadFile>): UploadFile {
  return {
    uid: file.uid || `rd-upload-${Date.now()}-${file.key}`,
    name: file.name || "file",
    key: file.key,
    url: file.url,
    status: file.status || "done",
    error: file.error || "error",
  }
}

// Block DnD event propagation if element have "data-no-dnd" attribute
const customHandler = (element: HTMLElement | null) => {
  let cur = element

  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false
    }
    cur = cur.parentElement as HTMLElement
  }

  return true
}

PointerSensor.activators = [
  {
    eventName: "onPointerDown" as const,
    handler: ({ nativeEvent: event }: PointerEvent, { onActivation }: PointerSensorOptions) => {
      if (!event.isPrimary || event.button !== 0) {
        return false
      }

      const isPass = customHandler(event.target as HTMLElement)
      if (!isPass) return false

      onActivation?.({ event })

      return true
    },
  },
]

MouseSensor.activators = [
  {
    eventName: "onMouseDown" as const,
    handler: ({ nativeEvent: event }: MouseEvent, { onActivation }: MouseSensorOptions) => {
      if (event.button === 2) {
        return false
      }

      const isPass = customHandler(event.target as HTMLElement)
      if (!isPass) return false

      onActivation?.({ event })

      return true
    },
  },
]

TouchSensor.activators = [
  {
    eventName: "onTouchStart" as const,
    handler: ({ nativeEvent: event }: TouchEvent, { onActivation }: TouchSensorOptions) => {
      const { touches } = event

      if (touches.length > 1) {
        return false
      }

      const isPass = customHandler(event.target as HTMLElement)
      if (!isPass) return false

      onActivation?.({ event })

      return true
    },
  },
]

export default function UploadImage({
  maxFiles = 9,
  multiple = true,
  maxSize = 2,
  onChange,
  value,
  showUploadTitle = true,
  className,
  wrapperClass,
  disabled = false,
}: UploadImageProps) {
  const [fileList, setFileList] = useState<UploadFile[]>(
    (Array.isArray(value)
      ? value?.map((item) => toObjectFile(item))
      : value && [toObjectFile(value)]) || [],
  )
  const [activeId, setActiveId] = useState<string | null>(null)

  const onBatchStart = (files: RdFile[]) => {
    let newFileList = [...fileList]
    const objectFileList = [...files]
    objectFileList.forEach((file) => {
      const fileIndex = newFileList.findIndex(({ uid }) => uid === file.uid)
      if (fileIndex === -1) {
        newFileList.push({
          uid: file.uid,
          name: file.name,
          status: "uploading",
        })
      } else {
        newFileList[fileIndex] = {
          ...newFileList[fileIndex],
          status: "uploading",
        }
      }
    })
    setTimeout(() => flushSync(() => setFileList(newFileList)), 0)
  }

  const onSuccess = (
    data: AxiosResponse<API.BaseResponse<UploadResponse>>["data"],
    file: RdFile,
  ) => {
    flushSync(() =>
      setFileList((prevList) => {
        const nextFileList = prevList.map((item) => {
          if (item.uid === file.uid) {
            return {
              ...item,
              status: "done",
              url: data.data.url,
              key: data.data.key,
            }
          }
          return item
        }) as UploadFile[]

        const triggerValues = multiple
          ? nextFileList.map((item) => ({
              key: item.key,
              url: item.url,
            }))
          : { key: nextFileList[0].key, url: nextFileList[0].url }
        onChange?.(triggerValues)
        return nextFileList
      }),
    )
  }

  const onError = (error: Error, file: RdFile) => {
    flushSync(() =>
      setFileList((prevList) => {
        const nextFileList = prevList.map((item) => {
          if (item.uid === file.uid) {
            item.error = error
            item.status = "error"
          }
          return item
        })
        onChange?.(nextFileList)
        return nextFileList
      }),
    )
  }

  const onRemove = (file: UploadFile) => {
    const matchKey = file.uid !== undefined ? "uid" : "name"
    setFileList((prevList) => {
      const nextFileList = prevList.filter((item) => item[matchKey] !== file[matchKey])
      const triggerValues = multiple
        ? nextFileList.map((item) => ({
            key: item.key,
            url: item.url,
          }))
        : nextFileList[0]
      onChange?.(triggerValues)
      return nextFileList
    })
  }

  const { getInputProps, getRootProps } = useUpload({
    url: "/upload/image",
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxSize,
    maxFiles,
    multiple,
    onBatchStart,
    onSuccess,
    onError,
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (
      over &&
      fileList.find((file) => file.uid === over.id)?.status === "done" &&
      active.id !== over.id
    ) {
      setFileList((prevList) => {
        const activeIndex = prevList.findIndex((file) => file.uid === active.id)
        const overIndex = prevList.findIndex((file) => file.uid === over.id)
        const nextFileList = arrayMove(prevList, activeIndex, overIndex)
        onChange?.(nextFileList)
        return nextFileList
      })
    }

    setActiveId(null)
  }

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
  }

  const items = useMemo(
    () => fileList.filter((file) => file.status === "done").map((file) => file.uid),
    [fileList],
  )

  useEffect(() => {
    if (value) {
      setFileList(
        Array.isArray(value) ? value.map((item) => toObjectFile(item)) : [toObjectFile(value)],
      )
    } else {
      setFileList([])
    }
  }, [value])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
    >
      <SortableContext items={items}>
        <div className="flex flex-wrap gap-4">
          {fileList.map((file) => (
            <UploadItem
              key={file.uid}
              file={file}
              onRemove={onRemove}
              disabled={disabled}
              wrapperClass={wrapperClass}
            />
          ))}
          {(fileList.length < maxFiles || maxFiles === 0) && (
            <div className="hover:bg-primary/3">
              <div
                {...getRootProps()}
                className={cn(
                  "hover:border-primary hover:bg-primary/3 border-border flex size-20 cursor-pointer items-center justify-center rounded-sm border border-dashed bg-transparent transition-all",
                  className,
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-1">
                  <ImagePlus />
                  {showUploadTitle && (
                    <div className="text-center text-xs leading-3.5">
                      {maxFiles
                        ? `Thêm hình ảnh (${fileList.length}/${maxFiles})`
                        : "Thêm hình ảnh"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </SortableContext>
      {createPortal(
        <DragOverlay>
          {activeId && fileList.length > 0 ? (
            <Item file={fileList.find((file) => file.uid === activeId)!} onRemove={onRemove} />
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )
}
