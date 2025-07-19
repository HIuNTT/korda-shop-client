import { Badge } from "@/components/ui/badge"
import { AddressType } from "@/constants/addressType"
import { Address } from "@/types/address"
import { House } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import { FaLocationDot } from "react-icons/fa6"
import { HiOutlineBuildingOffice } from "react-icons/hi2"
import AddressDrawer, { AddressDrawerRef } from "./AddressDrawer"

interface Props {
  value?: number
  defaultValue?: number
  options: Address[]
  onChange?: (value: number) => void
}

export default function AddressSelection({ defaultValue, options, value, onChange }: Props) {
  const [internalValue, setInternalValue] = useState(value || defaultValue)

  const addressDrawerRef = useRef<AddressDrawerRef>(null)

  const displayValue = useMemo(
    () => options.find((option) => option.id === internalValue),
    [internalValue, options],
  )

  const onSelectValue = (value: number) => {
    setInternalValue(value)
    onChange?.(value)
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-x-4">
          <div className="text-primary-6 flex items-center gap-2">
            <FaLocationDot />
            <span className="font-medium">Địa chỉ nhận hàng</span>
          </div>
          <div
            onClick={() => addressDrawerRef.current?.onOpen()}
            className="text-blue-7 cursor-pointer text-sm"
          >
            Thay đổi
          </div>
        </div>
        <div className="flex flex-col gap-2 pl-6">
          <div className="flex items-center gap-2 font-semibold">
            <div className="text-sm">{displayValue?.name}</div>
            <div className="bg-border h-3.5 w-[1px]"></div>
            <div className="text-sm">{displayValue?.phone}</div>

            {displayValue?.is_default && (
              <Badge
                variant="secondary"
                className="bg-primary-1 border-primary-3 text-primary-6 rounded-[4px] px-1.5 capitalize"
              >
                Mặc định
              </Badge>
            )}
          </div>
          <div className="flex items-start gap-2">
            {displayValue?.type === AddressType.HOME && (
              <Badge variant="secondary" className="bg-success-1 text-success-6 rounded-[4px] px-1">
                <House />
                Nhà
              </Badge>
            )}
            {displayValue?.type === AddressType.OFFICE && (
              <Badge variant="secondary" className="bg-gold-1 text-gold-6 rounded-[4px] px-1">
                <HiOutlineBuildingOffice />
                Văn phòng
              </Badge>
            )}
            <div className="text-muted-foreground text-sm">{displayValue?.full_address}</div>
          </div>
        </div>
      </div>

      <AddressDrawer onSelect={onSelectValue} value={internalValue} ref={addressDrawerRef} />
    </>
  )
}
