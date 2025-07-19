import * as React from "react"
import { DefaultOptionType, InternalFieldNames, RawValueType } from "./MySelect"

export function useOptions(options: DefaultOptionType[], fieldNames: InternalFieldNames) {
  return React.useMemo(() => {
    const valueOptions = new Map<RawValueType, DefaultOptionType>()
    const labelOptions = new Map<React.ReactNode, DefaultOptionType>()

    const dig = (optionList: DefaultOptionType[]) => {
      for (let i = 0; i < optionList.length; i++) {
        const option = optionList[i]
        if (!option[fieldNames.options]) {
          valueOptions.set(option[fieldNames.value], option)
          labelOptions.set(option[fieldNames.label], option)
        } else {
          dig(option[fieldNames.options])
        }
      }
    }

    dig(options)

    return {
      options,
      valueOptions,
      labelOptions,
    }
  }, [options, fieldNames])
}
