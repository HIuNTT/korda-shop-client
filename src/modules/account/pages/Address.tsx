import { Skeleton } from "@/components/ui/skeleton"
import { PlusIcon } from "lucide-react"
import FormAddressDrawer, { FormAddressRef } from "../components/Address/FormAddressDrawer"
import { useRef } from "react"
import { useGetAddressList } from "../services/getAddressList"
import AddressItem from "../components/Address/AddressItem"

export default function Address() {
  const formAddressRef = useRef<FormAddressRef>(null)

  const getAddressList = useGetAddressList()

  return (
    <div className="bg-background rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold">Sổ địa chỉ nhận hàng</div>
        <div
          className="text-primary flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm font-medium"
          onClick={() => {
            formAddressRef.current?.onOpen()
          }}
        >
          <PlusIcon className="size-5" />
          <span>Thêm địa chỉ</span>
        </div>
      </div>

      {/* Loading */}
      {getAddressList.isLoading ? (
        <div className="my-5 mb-0 grid gap-3 lg:grid-cols-2">
          {Array(4)
            .fill("")
            .map((_, idx) => (
              <div key={idx} className="bg-content-1 flex flex-col gap-1 rounded-lg p-4">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-5 w-32 rounded-sm" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-24 rounded-sm" />
                    <Skeleton className="h-5 w-20 rounded-sm" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-24 rounded-sm" />
                  <div className="bg-border h-[60%] w-[1px]"></div>
                  <Skeleton className="h-5 w-32 rounded-sm" />
                </div>
                <Skeleton className="h-5 w-full rounded-sm" />
                <div className="flex items-center justify-end gap-1">
                  <Skeleton className="h-8 w-16 rounded-sm" />
                  <div className="bg-border h-[60%] w-[1px]"></div>
                  <Skeleton className="h-8 w-24 rounded-sm" />
                </div>
              </div>
            ))}
        </div>
      ) : getAddressList.data && getAddressList.data.length > 0 ? (
        <div className="my-5 mb-0 grid gap-3 lg:grid-cols-2">
          {getAddressList.data.map((address) => (
            <AddressItem item={address} key={address.id} />
          ))}
        </div>
      ) : (
        <div className="my-10 mt-20 flex items-center justify-center">
          <div className="flex max-w-100 flex-col items-center gap-2">
            <img src="/img/empty-location.png" alt="Empty location" />
            <div className="text-lg font-semibold">Bạn chưa lưu địa chỉ nào</div>
            <div className="text-muted-foreground text-center">
              Cập nhật địa chỉ ngay để có trải nghiệm <br /> mua hàng nhanh nhất.
            </div>
          </div>
        </div>
      )}

      <FormAddressDrawer ref={formAddressRef} isDefault={getAddressList.data?.length === 0} />
    </div>
  )
}
