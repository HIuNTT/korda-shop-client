import Field from "@/components/core/field"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetAddressList } from "@/modules/account/services/getAddressList"
import AddressSelection from "./AddressSelection"
import { Controller, useFormContext } from "react-hook-form"
import { useEffect } from "react"

export default function ReceivingInfo() {
  const getUserAddress = useGetAddressList()

  const form = useFormContext()

  useEffect(() => {
    if (getUserAddress.isSuccess && getUserAddress.data.length > 0) {
      form.setValue("address_id", getUserAddress.data[0].id)
    } else {
      form.setValue("address_id", undefined)
    }
  }, [getUserAddress.data, form])

  return getUserAddress.isFetching ? (
    <div className="bg-background rounded-lg p-4">
      <Skeleton className="mb-4 h-5 w-2/5 rounded-sm md:h-6" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/10 rounded-sm" />
            <Skeleton className="h-5 w-1/10 rounded-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-1/8 rounded-sm" />
              <div className="bg-border h-4 w-[1px]"></div>
              <Skeleton className="h-5 w-1/7 rounded-sm" />
            </div>
            <Skeleton className="h-5 w-full rounded-sm" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-1/5 rounded-sm" />
          <Skeleton className="h-30 w-full rounded-sm" />
        </div>
      </div>
    </div>
  ) : (
    getUserAddress.data && (
      <div className="bg-background rounded-lg p-4">
        <div className="mb-4 text-base font-semibold md:text-lg">Thông tin nhận hàng</div>
        <div className="flex flex-col gap-6">
          <Controller
            control={form.control}
            name="address_id"
            render={({ field }) => (
              <AddressSelection
                value={field.value}
                defaultValue={getUserAddress.data[0].id}
                options={getUserAddress.data}
                onChange={field.onChange}
              />
            )}
          />
          <Field
            name="note"
            t="textarea"
            className="h-27 resize-none text-sm"
            label="Lời nhắn"
            placeholder="Lưu ý cho shop (Ví dụ: Giao hàng vào buổi sáng, không giao vào buổi chiều)"
          />
        </div>
      </div>
    )
  )
}
