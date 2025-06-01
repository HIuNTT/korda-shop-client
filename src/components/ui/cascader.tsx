import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"
import { TbXboxXFilled } from "react-icons/tb"

const VALUE_SPLIT = "__SHADCN_CASCADER_SPLIT__"

export interface BaseOptionType {
  label?: React.ReactNode
  value?: string | number | null
  children?: DefaultOptionType[]
}

export type DefaultOptionType = BaseOptionType & Record<string, any>

export interface FieldNames<
  OptionType extends DefaultOptionType = DefaultOptionType,
  ValueField extends keyof OptionType = keyof OptionType,
> {
  label?: keyof OptionType
  value?: keyof OptionType | ValueField
  children?: keyof OptionType
}

type SingleValueType = (string | number)[]

type LegacyKey = string | number

type InternalValueType = SingleValueType | SingleValueType[]

interface InternalFieldNames extends Required<FieldNames> {
  key: string
}

interface DisplayValueType {
  key?: React.Key
  value?: LegacyKey
  label?: React.ReactNode
  title?: React.ReactNode
  disabled?: boolean
  index?: number
}

type DisplayInfoType = "add" | "remove" | "clear"

type RenderNode = React.ReactNode

interface CascaderContextValue {
  options: NonNullable<CascaderProps["options"]>
  filedNames: InternalFieldNames
  values: SingleValueType[]
  // halfValues: SingleValueType[]
  onSelect: (valuePath: SingleValueType) => void
  expandTrigger?: "click" | "hover"
  optionRender?: CascaderProps["optionRender"]
  multiple?: boolean
  open?: boolean
  triggerOpen?: boolean
  toggleOpen: (open?: boolean) => void
  displayValues: DisplayValueType[]
  onDisplayValuesChange: (
    values: DisplayValueType[],
    info: {
      type: DisplayInfoType
      values: DisplayValueType[]
    },
  ) => void
  allowClear?: CascaderProps["allowClear"]
}

const CascaderContext = React.createContext<CascaderContextValue>({} as CascaderContextValue)

interface CascaderProps<
  OptionType extends DefaultOptionType = DefaultOptionType,
  ValueFiled extends keyof OptionType = keyof OptionType,
> {
  filedNames?: FieldNames<OptionType, ValueFiled>
  optionRender?: (option: OptionType) => React.ReactNode
  children?: React.ReactNode

  expandTrigger?: "click" | "hover"

  changeOnSelect?: boolean
  displayRender?: (label: string[], selectedOptions: OptionType[]) => React.ReactNode
  multiple?: boolean

  open?: boolean
  defaultOpen?: boolean

  allowClear?: boolean | { clearIcon?: RenderNode }

  value?: InternalValueType
  defaultValue?: InternalValueType
  onChange?: (
    value: InternalValueType,
    selectOptions: BaseOptionType[] | BaseOptionType[][],
  ) => void

  // options
  options?: OptionType[]
}

export function Cascader({
  children,
  defaultOpen,
  options,
  filedNames,
  expandTrigger,
  defaultValue,
  value,
  multiple,
  onChange,
  displayRender,
  allowClear = true,
}: CascaderProps) {
  const [open, setOpen] = React.useState<boolean>(defaultOpen ?? false)

  const [rawValues, setRawValues] = React.useState<SingleValueType[]>(
    toRawValues(value || defaultValue || []),
  )

  const mergedOptions = React.useMemo(() => options || [], [options])

  const mergedFieldNames = React.useMemo(
    () => fillFieldNames(filedNames),
    [JSON.stringify(filedNames)],
  )

  const getMissingValues = useMissingValues(mergedOptions, mergedFieldNames)

  const [checkedValues] = React.useMemo(() => getMissingValues(rawValues), [rawValues])

  const displayValues = useDisplayValues(
    checkedValues,
    mergedOptions,
    mergedFieldNames,
    multiple ?? false,
    displayRender,
  )

  const triggerChange = useEvent((nextValues: InternalValueType) => {
    setRawValues(toRawValues(nextValues))

    if (onChange) {
      const nextRawValues = toRawValues(nextValues)

      const valueOptions = nextRawValues.map((valueCells) =>
        toPathOptions(valueCells, mergedOptions, mergedFieldNames).map(
          (valueOpt) => valueOpt.option,
        ),
      )

      const triggerValues = multiple ? nextRawValues : nextRawValues[0]
      const triggerOptions = multiple ? valueOptions : valueOptions[0]

      onChange(triggerValues, triggerOptions)
    }
  })

  const handleSelection = useSelect(multiple ?? false, triggerChange, checkedValues)

  const onInternalSelect = useEvent((valuePath: SingleValueType) => {
    handleSelection(valuePath)
  })

  const onToggleOpen = React.useCallback(
    (newOpen?: boolean) => {
      setOpen(newOpen!)
    },
    [setOpen],
  )

  const onDisplayValuesChange: CascaderContextValue["onDisplayValuesChange"] = useEvent(
    (_, info) => {
      if (info.type === "clear") {
        triggerChange([]) // Clear all selections
        return
      }
    },
  )

  const cascaderContext = React.useMemo(
    () => ({
      options: mergedOptions,
      filedNames: mergedFieldNames,
      values: checkedValues,
      expandTrigger,
      open,
      multiple,
      onSelect: onInternalSelect,
      toggleOpen: onToggleOpen,
      displayValues,
      onDisplayValuesChange,
      allowClear,
    }),
    [
      mergedOptions,
      mergedFieldNames,
      checkedValues,
      expandTrigger,
      open,
      multiple,
      onInternalSelect,
      onToggleOpen,
      displayValues,
      onDisplayValuesChange,
      allowClear,
    ],
  )

  return (
    <CascaderContext.Provider value={cascaderContext}>
      <Popover open={open} onOpenChange={setOpen} defaultOpen={defaultOpen}>
        {children}
      </Popover>
    </CascaderContext.Provider>
  )
}

interface CascaderValueProps extends Omit<React.ComponentProps<"span">, "placeholder"> {
  placeholder?: React.ReactNode
}
export function CascaderValue({
  className,
  style,
  children,
  placeholder = "",
  ...valueProps
}: CascaderValueProps) {
  const { displayValues } = React.useContext(CascaderContext)

  const item = displayValues?.[0]

  const selectionTitle = item ? item.label?.toString() || item.title?.toString() : undefined

  const placeholderNode = React.useMemo<React.ReactNode>(() => {
    if (item) {
      return null
    }
    return (
      <span
        className={cn("text-muted-foreground pointer-events-none", className)}
        data-slot="cascader-placeholder"
        {...valueProps}
      >
        {placeholder}
      </span>
    )
  }, [item, placeholder])

  return (
    <>
      {item ? (
        <span
          title={selectionTitle}
          data-slot="cascader-value"
          className={cn(className)}
          {...valueProps}
        >
          {item.label}
        </span>
      ) : null}
      {placeholderNode}
    </>
  )
}

export function CascaderTrigger({
  className,
  children,
  size = "default",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  const { onDisplayValuesChange, displayValues, allowClear, toggleOpen } =
    React.useContext(CascaderContext)

  const onClearMouseDown: React.MouseEventHandler<HTMLSpanElement> = () => {
    onDisplayValuesChange([], {
      type: "clear",
      values: displayValues,
    })
    toggleOpen(false)
  }

  const { allowClear: mergedAllowClear, clearIcon: clearNode } = useAllowClear(
    onClearMouseDown,
    displayValues,
    allowClear,
  )

  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        data-slot="cascader-trigger"
        data-size={size}
        className={cn(
          "group relative",
          "border-input data-[state=open]:ring-ring/50 data-[state=open]:border-ring [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 min-w-cascader flex items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=cascader-value]:line-clamp-1 *:data-[slot=cascader-value]:flex *:data-[slot=cascader-value]:items-center *:data-[slot=cascader-value]:gap-2 data-[state=open]:ring-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2",
          className,
        )}
        {...props}
      >
        {children}
        {mergedAllowClear && clearNode}
        <ChevronDownIcon
          aria-hidden
          style={{ transition: "opacity 0.3s ease" }}
          className="size-4 opacity-50 group-hover:peer-data-[filled=true]:opacity-0"
        />
      </button>
    </PopoverTrigger>
  )
}

export function CascaderContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  const { options, filedNames, multiple, open, onSelect, toggleOpen } =
    React.useContext(CascaderContext)

  const [activeValueCells, setActiveValueCells] = useActive(multiple, open)

  React.useEffect(() => {
    const close = () => toggleOpen(false)
    window.addEventListener("blur", close)
    window.addEventListener("resize", close)

    return () => {
      window.removeEventListener("blur", close)
      window.removeEventListener("resize", close)
    }
  }, [toggleOpen])

  const onPathOpen = (nextValueCells: LegacyKey[]) => {
    setActiveValueCells(nextValueCells)
  }

  const onPathSelect = (valuePath: SingleValueType, leaf: boolean) => {
    onSelect(valuePath)

    if (!multiple && leaf) {
      console.log("onPathSelect", valuePath)

      toggleOpen(false)
    }
  }

  const optionColumns = React.useMemo(() => {
    const optionList = [{ options: options }]
    let currentList = options

    for (let i = 0; i < activeValueCells.length; i++) {
      const activeValueCell = activeValueCells[i]
      const currentOption = currentList.find(
        (option) => option[filedNames.value] === activeValueCell,
      )

      const subOptions = currentOption?.[filedNames.children]
      if (!subOptions?.length) break

      currentList = subOptions
      optionList.push({ options: subOptions })
    }

    return optionList
  }, [options, activeValueCells, filedNames])

  return (
    <CacheContent open={open}>
      <PopoverContent
        data-slot="cascader-content"
        className={cn(
          "w-auto min-w-auto p-0",
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) origin-(--radix-popover-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          className,
        )}
        align="start"
        {...props}
      >
        <div className="[&>div:not(:last-child)]:border-border flex flex-nowrap [&>div:not(:last-child)]:border-e">
          {optionColumns.map((col, index) => {
            const prevValuePath = activeValueCells.slice(0, index)
            const activeValue = activeValueCells[index]

            return (
              <CascaderColumn
                key={index}
                options={col.options}
                activeValue={activeValue}
                prevValuePath={prevValuePath}
                onActive={onPathOpen}
                onSelect={onPathSelect}
              />
            )
          })}
        </div>
      </PopoverContent>
    </CacheContent>
  )
}

interface CascaderColumnProps<OptionType extends DefaultOptionType = DefaultOptionType> {
  multiple?: boolean
  options: OptionType[]
  activeValue?: React.Key
  prevValuePath: React.Key[]
  onSelect: (valuePath: SingleValueType, leaf: boolean) => void
  onActive: (valuePath: SingleValueType) => void
}

function CascaderColumn<OptionType extends DefaultOptionType = DefaultOptionType>({
  options,
  activeValue,
  prevValuePath,
  onSelect,
  onActive,
}: CascaderColumnProps<OptionType>) {
  const { filedNames, expandTrigger, optionRender } = React.useContext(CascaderContext)

  const hoverOpen = expandTrigger === "hover"

  const optionInfoList = React.useMemo(
    () =>
      options.map((option) => {
        const label = option[filedNames.label]
        const value = option[filedNames.value]

        const isMergedLeaf = isLeaf(option, filedNames)

        const fullPath = [...prevValuePath, value]
        const fullPathKey = toPathKey(fullPath)

        return {
          label,
          value,
          isLeaf: isMergedLeaf,
          option,
          fullPath,
          fullPathKey,
        }
      }),
    [options, filedNames],
  )

  return (
    <div className="min-w-cascader-item p-1" role="menu">
      {optionInfoList.map(
        ({ label, value, isLeaf: isMergedLeaf, option, fullPath, fullPathKey }) => {
          const triggerOpenPath = () => {
            const nextValueCells = [...fullPath]
            if (hoverOpen && isMergedLeaf) {
              nextValueCells.pop()
            }
            onActive(nextValueCells)
          }

          const triggerSelect = () => {
            onSelect(fullPath, isMergedLeaf)
          }

          let title: string | undefined
          if (typeof option.title === "string") {
            title = option.title
          } else if (typeof label === "string") {
            title = label
          }

          return (
            <div
              key={fullPathKey}
              data-path-key={fullPathKey}
              className={cn(
                "hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center justify-between gap-1 rounded-sm px-3 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
                "transition-all duration-200",
                "[&_svg:not([class*='text-'])]:text-muted-foreground",
                activeValue === value && "text-accent-foreground bg-accent",
              )}
              data-slot="cascader-option"
              title={title}
              onClick={() => {
                triggerOpenPath()

                if (isMergedLeaf) {
                  triggerSelect()
                }
              }}
              onMouseEnter={() => {
                if (hoverOpen) {
                  triggerOpenPath()
                }
              }}
            >
              <span>{optionRender ? optionRender(option) : label}</span>
              {!isMergedLeaf && <ChevronRightIcon className="translate-x-1" />}
            </div>
          )
        },
      )}
    </div>
  )
}

interface CacheContentProps {
  children?: React.ReactNode
  open?: boolean
}

/** Lưu lại nội dung của cascader content khi popover close, tránh gây ra thay đổi nội dung nhấp nháy khi close */
const CacheContent = React.memo(
  ({ children }: CacheContentProps) => children as React.ReactElement,
  (_, next) => !next.open, // Chỉ render lại children khi open = true, nếu open = false thì !next.open = true => coi như props không thay đổi
)

function isLeaf(option: DefaultOptionType, fieldNames: FieldNames) {
  return option.isLeaf ?? !option[fieldNames.children as string]?.length
}

function useActive(
  multiple?: boolean,
  open?: boolean,
): [LegacyKey[], (activeValueCells: LegacyKey[]) => void] {
  const { values } = React.useContext(CascaderContext)

  const firstValueCells = values[0]

  const [activeValueCells, setActiveValueCells] = React.useState<LegacyKey[]>([])

  React.useEffect(() => {
    if (!multiple) {
      console.log("useActive", firstValueCells)

      setActiveValueCells(firstValueCells || [])
    }
  }, [open, firstValueCells])

  return [activeValueCells, setActiveValueCells]
}

function fillFieldNames(fieldNames?: FieldNames): InternalFieldNames {
  const { label, value, children } = fieldNames || {}
  const val = value || "value"

  return {
    label: label || "label",
    value: val,
    children: children || "children",
    key: val as string,
  }
}

function useEvent<T extends Function>(callback: T): T {
  const fnRef = React.useRef<any>(callback)

  const memoFn = React.useCallback<T>(((...args: any) => fnRef.current?.(...args)) as any, [])

  return memoFn
}

function isMultipleValue(value: InternalValueType): value is SingleValueType[] {
  return Array.isArray(value) && Array.isArray(value[0])
}

function toRawValues(value?: InternalValueType): SingleValueType[] {
  if (!value) return []

  if (isMultipleValue(value)) return value

  return (value.length === 0 ? [] : [value]).map((val) => (Array.isArray(val) ? val : [val]))
}

/** Chuyển mảng giá trị thành mảng các option với kiểu như ban đầu */
function toPathOptions(
  valueCells: SingleValueType,
  options: DefaultOptionType[],
  fieldNames: InternalFieldNames,
) {
  let currentList = options
  const valueOptions: {
    value: SingleValueType[number]
    index: number
    option: DefaultOptionType
  }[] = []

  for (let i = 0; i < valueCells.length; i++) {
    const valueCell = valueCells[i]
    const foundIndex = currentList.findIndex((option) => {
      const val = option[fieldNames.value]
      return val === valueCell
    })

    const foundOption = foundIndex !== -1 ? currentList?.[foundIndex] : null

    valueOptions.push({
      value: foundOption?.[fieldNames.value] ?? valueCell,
      index: foundIndex,
      option: foundOption as DefaultOptionType,
    })

    currentList = foundOption?.[fieldNames.children]
  }

  return valueOptions
}

function useMissingValues(options: DefaultOptionType[], fieldNames: InternalFieldNames) {
  return React.useCallback(
    (rawValues: SingleValueType[]): [SingleValueType[], SingleValueType[]] => {
      const missingValues: SingleValueType[] = []
      const existsValues: SingleValueType[] = []

      rawValues.forEach((valueCell) => {
        const pathOptions = toPathOptions(valueCell, options, fieldNames)
        if (pathOptions.every((opt) => opt.option)) {
          existsValues.push(valueCell)
        } else {
          missingValues.push(valueCell)
        }
      })

      return [existsValues, missingValues]
    },
    [options, fieldNames],
  )
}

function useSelect(
  multiple: boolean,
  triggerChange: (nextValues: InternalValueType) => void,
  checkedValues: SingleValueType[],
) {
  const values = checkedValues
  console.log("useSelect", values)

  return (valuePath: SingleValueType) => {
    if (!multiple) {
      triggerChange(valuePath)
    } else {
      const nextValues = [...values, valuePath]
      console.log("onInternalSelect", values)

      triggerChange(nextValues)
    }
  }
}

function toPathKey(value: SingleValueType) {
  return value.join(VALUE_SPLIT)
}

function useDisplayValues(
  rawValues: SingleValueType[],
  options: DefaultOptionType[],
  fieldNames: InternalFieldNames,
  multiple: boolean,
  displayRender: CascaderProps["displayRender"],
) {
  return React.useMemo(() => {
    const mergedDisplayRender =
      displayRender ||
      ((labels) => {
        const mergedLabels: React.ReactNode[] = multiple ? labels.slice(-1) : labels
        const SPLIT = " / "

        if (mergedLabels.every((label) => ["string", "number"].includes(typeof label))) {
          return mergedLabels.join(SPLIT)
        }
      })

    return rawValues.map((valueCells) => {
      const valueOptions = toPathOptions(valueCells, options, fieldNames)

      const label = mergedDisplayRender(
        valueOptions.map(({ option, value }) => option?.[fieldNames.label] ?? value),
        valueOptions.map(({ option }) => option),
      )

      const value = toPathKey(valueCells)

      return {
        label,
        value,
        key: value,
        valueCells,
      }
    })
  }, [rawValues, options, fieldNames, displayRender, multiple])
}

function useAllowClear(
  onClearMouseDown: React.MouseEventHandler<HTMLSpanElement>,
  displayValues: DisplayValueType[],
  allowClear?: CascaderProps["allowClear"],
) {
  const mergedAllowClear = React.useMemo<boolean>(() => {
    if (!!allowClear && displayValues.length) {
      return true
    }
    return false
  }, [allowClear, displayValues.length])

  const mergedClearIcon = React.useMemo(() => {
    if (typeof allowClear === "object") {
      return allowClear.clearIcon
    }
  }, [allowClear])

  return {
    allowClear: mergedAllowClear,
    clearIcon: (
      <span
        data-slot="clear-icon"
        data-filled={mergedAllowClear}
        onMouseDown={onClearMouseDown}
        style={{ transition: "opacity 0.3s ease, color 0.2s ease" }}
        className="peer absolute right-3 z-50 cursor-pointer opacity-0 group-hover:opacity-70 hover:opacity-100"
      >
        {mergedClearIcon || <TbXboxXFilled className="size-3.5" />}
      </span>
    ),
  }
}
