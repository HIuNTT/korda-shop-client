import { api } from "@/configs/api"
import { useMutation } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { useEffect, useState } from "react"
import { Accept, ErrorCode, FileRejection, useDropzone } from "react-dropzone"
import { toast } from "sonner"

export interface RdFile extends File {
  uid: string
}

export interface UseUploadProps<T> {
  url: string
  accept: Accept
  /** Đơn vị MB */
  maxSize: number
  maxFiles?: number
  multiple?: boolean
  onSuccess?: (responseData: AxiosResponse<T>["data"], file: RdFile) => void
  onBatchStart?: (files: RdFile[]) => void
  onError?: (error: Error, file: RdFile) => void
  name?: string
}

export default function useUpload<T = unknown>({
  url,
  accept,
  maxSize,
  maxFiles,
  multiple,
  onSuccess,
  onBatchStart,
  onError,
  name = "file",
}: UseUploadProps<T>) {
  const [files, setFiles] = useState<File[]>([])

  const { mutateAsync } = useMutation({
    mutationFn: async (data: FormData) =>
      (await api.post<T>(url, data, { headers: { "Content-Type": "multipart/form-data" } })).data,
    meta: {
      skipErrorHandle: true, // Skip global error handling for this mutation
    },
  })

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      let messages = ""
      fileRejections.map(({ file, errors }) => {
        const fileName = `"${file.name}" không thể tải lên.`

        const errorMessages = [fileName]
        errors.forEach((error) => {
          if (error.code === ErrorCode.FileInvalidType)
            errorMessages.push(
              `- Định dạng file không hợp lệ (chỉ hỗ trợ ${Object.values(accept).flat().join(" ")})`,
            )
          if (error.code === ErrorCode.FileTooLarge)
            errorMessages.push(`- Kích thước file vượt quá ${Math.round(maxSize * 10) / 10} MB`)
        })

        messages = errorMessages.join("\n")
      })
      toast.error("Lưu ý", {
        description: messages,
        closeButton: true,
      })
    }

    if (acceptedFiles.length) {
      setFiles(acceptedFiles)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSize * 1024 * 1024,
    multiple,
  })

  const uploadFiles = async (files: File[]) => {
    const originFiles = [...files] as RdFile[]
    const getUid = uid()
    const postFiles = originFiles.map((file: RdFile) => {
      file.uid = getUid()
      return file
    })

    let exceedMaxFiles = false
    if (maxFiles && multiple && postFiles.length > maxFiles) {
      postFiles.splice(maxFiles)
      exceedMaxFiles = true
    }

    onBatchStart?.(postFiles)

    await Promise.all(
      postFiles.map(async (file) => {
        const formData = new FormData()
        formData.append(name, file)

        try {
          const data = await mutateAsync(formData)
          onSuccess?.(data, file)
        } catch (error) {
          onError?.(error as Error, file)
        }
      }),
    )

    if (exceedMaxFiles) {
      toast.error(`Chỉ được tải lên tối đa ${maxFiles} tệp`, {
        closeButton: true,
      })
    }
  }

  useEffect(() => {
    if (files.length > 0) {
      uploadFiles(files)
    }
  }, [files])

  return {
    getRootProps,
    getInputProps,
  }
}

function uid() {
  const now = +new Date()
  let index = 0

  return () => `rd-upload-${now}-${++index}`
}
