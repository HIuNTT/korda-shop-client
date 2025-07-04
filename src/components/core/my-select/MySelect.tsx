import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { aggregateOptions, fillFieldNames, isRawValue, toArray } from "./util"
import { cn } from "@/lib/utils"
import { Check, ChevronDownIcon, X } from "lucide-react"
import { useOptions } from "./useOptions"
import { TbXboxXFilled } from "react-icons/tb"

export type RawValueType = string | number
export interface LabelInValueType {
  label: string
  value: RawValueType
}

interface DisplayValueType {
  key?: React.Key
  value?: RawValueType
  label?: string
  disabled?: boolean
  title?: React.ReactNode
}

export type DraftValueType = RawValueType | DisplayValueType | (RawValueType | DisplayValueType)[]

export interface BaseOptionType {
  disabled?: boolean
  title?: string
  [name: string]: any
}

export interface DefaultOptionType extends BaseOptionType {
  label?: string
  value?: string | number | null
  options?: Omit<DefaultOptionType, "options">[]
}

export interface FieldNames {
  value?: string
  label?: string
  groupLabel?: string
  options?: string
}

export interface InternalFieldNames extends Required<FieldNames> {
  key: string
}

export interface MySelectProps<
  ValueType = any,
  OptionType extends BaseOptionType = DefaultOptionType,
> extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue"> {
  fieldNames?: FieldNames
  size?: "sm" | "default" | "lg" | "sm"

  options?: OptionType[]

  allowClear?: boolean

  notFoundContent?: React.ReactNode

  mode?: "multiple"
  value?: ValueType | null
  defaultValue?: ValueType | null
  maxCount?: number
  onValueChange?: (value: ValueType) => void
  placeholder?: string
  searchPlaceholder?: string
}

export const MySelect = React.forwardRef<HTMLButtonElement, MySelectProps<any, DefaultOptionType>>(
  (props, ref) => {
    const {
      fieldNames,
      size = "default",

      options,

      allowClear = false,

      notFoundContent = "Not Found",

      mode,
      value,
      defaultValue,
      maxCount,
      onValueChange,
      placeholder,
      searchPlaceholder,

      className,
      ...restProps
    } = props

    const [open, setOpen] = React.useState<boolean>(false)

    const multiple = mode === "multiple"

    const mergedFieldNames = React.useMemo(
      () => fillFieldNames(fieldNames),
      [JSON.stringify(fieldNames)],
    )

    const mergedOptions = React.useMemo(() => options || [], [options])

    const displayOptions = React.useMemo(
      () => aggregateOptions(options || [], mergedFieldNames),
      [options, mergedFieldNames],
    )

    const { valueOptions } = useOptions(mergedOptions, mergedFieldNames)

    const convertToLabelValues = React.useCallback(
      (draftValues: DraftValueType) => {
        const valueList = toArray(draftValues)

        return valueList.map((val) => {
          let rawValue: RawValueType
          let rawLabel: string | undefined
          let rawDisabled: boolean | undefined
          let rawTitle: string | undefined

          if (isRawValue(val)) {
            rawValue = val
          } else {
            rawValue = val.value!
            rawLabel = val.label!
          }

          const option = valueOptions.get(rawValue)
          if (option) {
            rawLabel = option?.[mergedFieldNames.label]
            rawDisabled = option?.disabled
            rawTitle = option?.title
          }

          return {
            label: rawLabel,
            value: rawValue,
            key: rawValue,
            disabled: rawDisabled,
            title: rawTitle,
          }
        })
      },
      [mergedFieldNames, valueOptions],
    )

    const [internalValue, setInternalValue] = React.useState(
      convertToLabelValues(value || defaultValue),
    )

    const displayValues = React.useMemo(() => {
      if (!mode && internalValue.length === 1) {
        const firstValue = internalValue[0]
        if (
          firstValue.value === null &&
          (firstValue.label === null || firstValue.label === undefined)
        ) {
          return []
        }
      }

      return internalValue.map((item) => ({
        ...item,
        label: item.label,
      }))
    }, [mode, internalValue])

    const rawValues = React.useMemo(
      () => new Set(internalValue.map((v) => v.value)),
      [internalValue],
    )

    const triggerChange = (values: DraftValueType) => {
      const labeledValues = convertToLabelValues(values)
      setInternalValue(labeledValues)

      if (
        onValueChange &&
        // Trigger event only when value changed
        (labeledValues.length !== internalValue.length ||
          labeledValues.some((newVal, index) => internalValue[index]?.value !== newVal?.value))
      ) {
        const returnValues = labeledValues.map((v) => v.value)

        onValueChange(multiple ? returnValues : returnValues[0])
      }
    }

    const onInternalSelect = (val: RawValueType, info: { selected: boolean }) => {
      let cloneValues: (RawValueType | DisplayValueType)[]

      // Single mode always trigger select only with option list
      const mergedSelect = multiple ? info.selected : true

      if (mergedSelect) {
        cloneValues = multiple ? [...internalValue, val] : [val]
      } else {
        cloneValues = internalValue.filter((v) => v.value !== val)
      }

      triggerChange(cloneValues)
    }

    const onSelectValue = (value: RawValueType) => {
      if (value !== undefined) {
        onInternalSelect(value, { selected: !rawValues.has(value) })
      }
      if (!multiple) {
        setOpen(false)
      }
    }

    const overMaxCount = React.useMemo<boolean>(
      () => multiple && typeof maxCount === "number" && rawValues?.size >= maxCount,
      [multiple, maxCount, rawValues?.size],
    )

    const mergedAllowClear = !!allowClear && !!displayValues.length

    const onClearMouseDown: React.MouseEventHandler<HTMLScriptElement> = () => {
      triggerChange([])
      setOpen(false)
    }

    const onSelectorRemove = (val: DisplayValueType) => {
      const newValues = displayValues.filter((i) => i !== val)
      triggerChange(newValues)
    }

    React.useEffect(() => {
      const close = () => setOpen(false)

      window.addEventListener("blur", close)
      window.addEventListener("resize", close)

      return () => {
        window.removeEventListener("blur", close)
        window.removeEventListener("resize", close)
      }
    }, [setOpen])

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            {...restProps}
            type="button"
            data-size={size}
            data-slot="select-trigger"
            className={cn(
              "group relative",
              "border-input data-[state=open]:ring-ring/50 data-[state=open]:border-ring [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 min-w-cascader flex items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-0.5 data-[state=open]:ring-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 data-[size=sm]:px-2.5",
              multiple &&
                "py-0 data-[size=default]:min-h-9 data-[size=lg]:min-h-10 data-[size=sm]:min-h-8",
              !multiple && "data-[size=default]:h-9 data-[size=lg]:h-10 data-[size=sm]:h-8",
              className,
            )}
          >
            {!displayValues.length && (
              <span className="text-muted-foreground select-none">{placeholder}</span>
            )}
            {!multiple && displayValues.length && displayValues[0] ? (
              <span>{displayValues[0].label}</span>
            ) : null}
            {multiple && displayValues.length > 0 ? (
              <div
                className={cn("flex flex-wrap", "my-0.5 h-full data-[slot=select-value]:text-sm")}
                data-slot="select-value"
              >
                {displayValues.map((val) => {
                  const onClose = (event?: React.MouseEvent) => {
                    if (event) {
                      event.stopPropagation()
                    }

                    onSelectorRemove(val)
                  }

                  return (
                    <span
                      key={val.key}
                      className={cn(
                        "bg-secondary text-accent-foreground flex items-center gap-0.5 rounded px-1.5",
                        size === "default" && "h-7",
                        size === "lg" && "h-8",
                        size === "sm" && "h-6 text-sm",
                      )}
                    >
                      {val.label}
                      <span
                        className="text-primary-foreground cursor-pointer opacity-50 hover:opacity-100"
                        onClick={onClose}
                      >
                        <X className="size-3.5" />
                      </span>
                    </span>
                  )
                })}
              </div>
            ) : null}
            {mergedAllowClear && (
              <span
                data-slot="clear-icon"
                data-filled={mergedAllowClear}
                onMouseDown={onClearMouseDown}
                style={{ transition: "opacity 0.3s ease, color 0.2s ease" }}
                className="peer absolute right-3 z-50 cursor-pointer opacity-0 group-hover:opacity-70 hover:opacity-100"
              >
                <TbXboxXFilled className="size-3.5" />
              </span>
            )}
            <ChevronDownIcon
              aria-hidden
              style={{ transition: "opacity 0.3s ease" }}
              className="size-4 opacity-50 group-hover:peer-data-[filled=true]:opacity-0"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{notFoundContent}</CommandEmpty>
              {displayOptions.map((group, index) => (
                <CommandGroup heading={group.label || ""} key={index}>
                  {group.options?.map((option) => {
                    const selected = rawValues.has(option.value!)

                    const mergedDisabled = option.data?.disabled || (!selected && overMaxCount)

                    return (
                      <CommandItem
                        disabled={mergedDisabled}
                        value={option.label}
                        key={option.value}
                        className={cn("cursor-pointer")}
                        onSelect={() => {
                          if (!mergedDisabled) {
                            onSelectValue(option.value!)
                          }
                        }}
                      >
                        {option.label}
                        <Check className={cn("ml-auto", selected ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)
