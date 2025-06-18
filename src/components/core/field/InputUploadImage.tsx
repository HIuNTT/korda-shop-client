import { FormControl } from "@/components/ui/form"
import UploadImage, { UploadImageProps } from "@/modules/product-admin/components/upload-image"

export interface InputUploadImageProps extends UploadImageProps {
  t: "input-upload-image"
  hideError?: boolean
}

export default function InputUploadImage({ t, hideError, ...props }: InputUploadImageProps) {
  if (t === "input-upload-image") {
    return (
      <FormControl hideError={hideError}>
        <UploadImage {...props} />
      </FormControl>
    )
  }
}
