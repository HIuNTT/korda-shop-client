import { FieldProps } from "@/components/core/field"

export enum InputType {
  TEXT_FIELD = 0,
  TEXT_AREA = 1,
  DROPDOWN = 2,
  MULTI_SELECT = 3,
}

export const InputTypeMap: Record<number, FieldProps["t"]> = {
  [InputType.TEXT_FIELD]: "input",
  [InputType.TEXT_AREA]: "input-textarea",
  [InputType.DROPDOWN]: "input-my-select",
  [InputType.MULTI_SELECT]: "input-my-select",
}
