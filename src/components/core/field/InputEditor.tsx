import TinymceEditor, { TinymceEditorProps } from "@/components/common/tinymce"
import { FormControl } from "@/components/ui/form"
import { api } from "@/configs/api"
import { useMutation } from "@tanstack/react-query"
import { InitOptions } from "@tinymce/tinymce-react/lib/es2015/main/ts/components/Editor"

export interface InputEditorProps extends TinymceEditorProps {
  t: "input-editor"
  hideError?: boolean
}

function useUploadImage() {
  return useMutation({
    mutationFn: async (data: FormData) =>
      (
        await api.post<API.BaseResponse<{ key: string; url: string }>>("/upload/image", data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data.data,
    meta: {
      skipErrorHandle: true,
    },
  })
}

export default function InputEditor({ t, hideError, init, ...props }: InputEditorProps) {
  if (t === "input-editor") {
    const { mutateAsync } = useUploadImage()

    const initOptions: InitOptions = {
      images_upload_handler: async (blobInfo, progress) => {
        const formData = new FormData()
        formData.append("file", blobInfo.blob(), blobInfo.filename())

        const data = await mutateAsync(formData)
        progress(100)
        return data.url
      },
    }

    return (
      <FormControl hideError={hideError}>
        <TinymceEditor {...props} init={{ ...init, ...initOptions }} />
      </FormControl>
    )
  }
}
