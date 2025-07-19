import type {
  BaseOptionType,
  DefaultOptionType,
  DraftValueType,
  FieldNames,
  InternalFieldNames,
  RawValueType,
} from "./MySelect"

export function fillFieldNames(fieldNames?: FieldNames): InternalFieldNames {
  const { label, value, options, groupLabel } = fieldNames || {}
  const val = value || "value"

  return {
    label: label || "label",
    value: val,
    options: options || "options",
    groupLabel: groupLabel || label || "label",
    key: val as string,
  }
}

export function aggregateOptions<OptionType extends BaseOptionType = DefaultOptionType>(
  options: OptionType[],
  fieldNames: FieldNames,
) {
  const aggregateList: AggregateOptionData<OptionType>[] = []

  const {
    label: fieldLabel,
    value: fieldValue,
    options: fieldOptions,
    groupLabel,
  } = fillFieldNames(fieldNames)

  options.forEach((data) => {
    if (fieldOptions in data) {
      aggregateList.push({
        label: data[groupLabel],
        data,
        options: data[fieldOptions].map((option: any) => ({
          label: option[fieldLabel],
          data: option,
          value: option[fieldValue],
        })),
      })
    } else {
      const lastElement = aggregateList[aggregateList.length - 1]
      if (lastElement && lastElement.label === undefined) {
        lastElement.options?.push({ label: data[fieldLabel], data, value: data[fieldValue] })
      } else {
        aggregateList.push({
          options: [{ label: data[fieldLabel], data, value: data[fieldValue] }],
        })
      }
    }
  })

  return aggregateList
}

interface AggregateOptionData<OptionType> {
  label?: string
  data?: OptionType
  value?: string | number
  options?: Omit<AggregateOptionData<OptionType>, "options">[]
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : value !== undefined ? [value] : []
}

export function isRawValue(value: DraftValueType): value is RawValueType {
  return !value || typeof value !== "object"
}
