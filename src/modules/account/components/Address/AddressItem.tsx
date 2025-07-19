import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddressType } from "@/constants/addressType"
import { Address } from "@/types/address"
import { CircleCheckIcon, House } from "lucide-react"
import { HiOutlineBuildingOffice } from "react-icons/hi2"
import FormAddressDrawer, { FormAddressRef } from "./FormAddressDrawer"
import { useRef } from "react"
import ConfirmDialog, { ConfirmDialogRef } from "@/components/common/ConfirmDialog"
import { useDeleteAddress } from "../../services/deleteAddress"
import { queryClient } from "@/configs/queryClient"
import { toast } from "sonner"

interface Props {
  item: Address
}

export default function AddressItem({ item }: Props) {
  const formAddressRef = useRef<FormAddressRef>(null)
  const confirmDialogRef = useRef<ConfirmDialogRef>(null)

  const deleteAddress = useDeleteAddress()

  const handleDeleteAddress = (addressId: number) => {
    deleteAddress.mutate(addressId, {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: ["get-address-list"],
        })
        confirmDialogRef.current?.onClose()
        toast.success("Xóa địa chỉ thành công")
      },
    })
  }

  return (
    <>
      <div className="bg-content-1 flex flex-col gap-1 rounded-lg p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-base font-semibold">{item.name}</div>
          <div className="flex items-center gap-2">
            {item.type === AddressType.HOME && (
              <Badge variant="secondary" className="bg-content-3 rounded-[4px] px-1">
                <House />
                Nhà
              </Badge>
            )}
            {item.type === AddressType.OFFICE && (
              <Badge variant="secondary" className="bg-content-3 rounded-[4px] px-1">
                <HiOutlineBuildingOffice />
                Văn phòng
              </Badge>
            )}
            {item.is_default && (
              <Badge
                variant="outline"
                className="rounded-[4px] border-green-500 px-1 text-green-500"
              >
                <CircleCheckIcon />
                Mặc định
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-1 text-sm font-medium">{item.phone}</div>
        <div className="text-muted-foreground text-sm">{item.full_address}</div>
        <div className="flex items-center justify-end gap-1">
          <Button
            onClick={() => confirmDialogRef.current?.onOpen()}
            variant="ghost"
            className="hover:bg-content-3/50 min-w-fit"
          >
            Xóa
          </Button>
          <div className="bg-border h-[60%] w-[1px]"></div>
          <Button
            className="min-w-fit"
            variant="light"
            onClick={() => formAddressRef.current?.onOpen()}
          >
            Cập nhật
          </Button>
        </div>
      </div>

      <FormAddressDrawer ref={formAddressRef} address={item} />

      <ConfirmDialog
        ref={confirmDialogRef}
        title="Xóa địa chỉ"
        body={
          <div className="flex flex-col items-center gap-3">
            <img width={241} src="/img/cart-trash.png" alt="Remove address" />
            <p className="text-center text-base font-medium">Bạn chắc chắn muốn xóa địa chỉ này?</p>
          </div>
        }
        btnAcceptProps={{
          children: "Xóa",
          className: "flex-1",
          isLoading: deleteAddress.isPending,
          onClick: () => handleDeleteAddress(item.id),
          type: "submit",
        }}
        className="sm:max-w-[400px]"
      />
    </>
  )
}
