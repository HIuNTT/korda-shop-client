import { useTheme } from "@/stores/theme"
import { Editor } from "@tinymce/tinymce-react"
import { type IEditorPropTypes } from "@tinymce/tinymce-react/lib/es2015/main/ts/components/EditorPropTypes"
import { plugins as defaultPlugins, toolbar as defaultToolbar } from "./constants"
import { InitOptions } from "@tinymce/tinymce-react/lib/es2015/main/ts/components/Editor"

export interface TinymceEditorProps extends Partial<IEditorPropTypes> {
  height?: string | number
  width?: string | number
  showImageUpload?: boolean
}

export default function TinymceEditor(props: TinymceEditorProps) {
  const { theme } = useTheme()

  const {
    toolbar = defaultToolbar,
    plugins = defaultPlugins,
    height = 400,
    width = "auto",
    init,
    ...restProps
  } = props

  const skinName = theme === "dark" ? "oxide-dark" : "oxide"

  const initOptions: InitOptions = {
    base_url: "/tinymce-resource",
    license_key: "gpl",
    height,
    width,
    toolbar,
    menubar: "file edit view insert format tools table",
    plugins,
    branding: false,
    link_default_target: "_blank",
    link_title: false,
    promotion: false,
    resize: true,
    skin: skinName,
    content_style: "body { font-family: 'Noto Sans', sans-serif; }",
    image_advtab: true,
    quickbars_insert_toolbar: false,
    quickbars_selection_toolbar:
      "bold italic underline | blocks | bullist numlist | blockquote quicklink",
    contextmenu: "undo redo | listprops | inserttable | cell row column deletetable | help",
    valid_elements: "*[*]",
    extended_valid_elements: "*[*]",
    ...init,
  }

  return (
    <Editor
      tinymceScriptSrc={"/tinymce-resource/tinymce.min.js"}
      init={initOptions}
      {...restProps}
    />
  )
}
