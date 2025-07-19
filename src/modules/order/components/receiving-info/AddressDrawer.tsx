import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"
import { AddressType } from "@/constants/addressType"
import { useDisclosure } from "@/hooks/use-disclosure"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useGetAddressList } from "@/modules/account/services/getAddressList"
import { House, X } from "lucide-react"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { HiOutlineBuildingOffice } from "react-icons/hi2"
import { TbEdit } from "react-icons/tb"

export interface AddressDrawerRef {
  onOpen: () => void
}

interface Props {
  value?: number
  onSelect: (value: number) => void
}

const AddressDrawer = forwardRef<AddressDrawerRef, Props>(({ value, onSelect }, ref) => {
  const [step, setStep] = useState<"list" | "create" | "edit">("list")

  const activeValue = useRef<number>(value)

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const getUserAddress = useGetAddressList(!!isOpen, "address-drawer")

  console.log("getUserAddress")

  useImperativeHandle(ref, () => ({
    onOpen,
  }))

  const handleSelect = () => {
    if (activeValue.current) {
      onSelect(activeValue.current)
      onClose()
    }
  }

  return (
    <Drawer
      autoFocus={false}
      open={isOpen}
      onOpenChange={onOpenChange}
      direction={isDesktop ? "right" : "bottom"}
    >
      <DrawerContent
        className="data-[vaul-drawer-direction=bottom]:max-h-[90vh] data-[vaul-drawer-direction=right]:md:max-w-lg"
        showGrabber={false}
      >
        <DrawerHeader className="flex flex-row items-center justify-between border-b">
          <DrawerTitle>
            {step === "list"
              ? "Địa chỉ của tôi"
              : step === "create"
                ? "Thêm địa chỉ mới"
                : "Cập nhật địa chỉ"}
          </DrawerTitle>
          <DrawerDescription></DrawerDescription>
          <DrawerClose asChild className="cursor-pointer" data-vaul-no-drag>
            <X />
          </DrawerClose>
        </DrawerHeader>

        {step === "list" &&
          (getUserAddress.isFetching ? (
            <div className="flex h-full items-center justify-center">
              <Spinner />
            </div>
          ) : (
            getUserAddress.data && (
              <div>
                <RadioGroup
                  defaultValue={value?.toString()}
                  onValueChange={(value) => (activeValue.current = Number(value))}
                  className="gap-0"
                >
                  {getUserAddress.data.map((address) => {
                    return (
                      <Label
                        htmlFor={`${address.id}-address-item`}
                        className="cursor-pointer items-center gap-4 border-b border-dashed p-4 text-start whitespace-normal"
                      >
                        <RadioGroupItem
                          id={`${address.id}-address-item`}
                          value={address.id.toString()}
                        />
                        <div className="flex w-full flex-col gap-1">
                          <div className="mb-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {address.type === AddressType.HOME && (
                                <Badge
                                  variant="secondary"
                                  className="bg-success-1 text-success-6 rounded-[4px] px-1"
                                >
                                  <House />
                                  Nhà
                                </Badge>
                              )}
                              {address.type === AddressType.OFFICE && (
                                <Badge
                                  variant="secondary"
                                  className="bg-gold-1 text-gold-6 rounded-[4px] px-1"
                                >
                                  <HiOutlineBuildingOffice />
                                  Văn phòng
                                </Badge>
                              )}
                              {address.is_default && (
                                <Badge
                                  variant="secondary"
                                  className="bg-primary-1 text-primary-6 rounded-[4px] px-1.5 capitalize"
                                >
                                  Mặc định
                                </Badge>
                              )}
                            </div>

                            <div
                              onClick={(e) => e.preventDefault()}
                              className="text-blue-7 flex items-center gap-1 text-sm font-normal"
                            >
                              <TbEdit className="size-4.5" />
                              <span>Cập nhật</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <div>{address.name}</div>
                            <div className="bg-border h-3.5 w-[1px]"></div>
                            <div>{address.phone}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-muted-foreground text-sm font-normal">
                              {address.full_address}
                            </div>
                            <div className="w-20"></div>
                          </div>
                        </div>
                      </Label>
                    )
                  })}
                </RadioGroup>
              </div>
            )
          ))}

        <DrawerFooter className="p-0">
          <div className="grid grid-cols-2 gap-4 px-4 py-5 shadow-[0_-1px_5px_0px_rgba(0,0,0,0.1)] dark:shadow-[0_-2px_5px_0px_rgba(255,255,255,0.1)]">
            {step === "list" && (
              <>
                <Button onClick={onClose} className="w-full" size="lg" variant="outline">
                  Hủy
                </Button>
                <Button onClick={handleSelect} className="w-full" size="lg">
                  Xác nhận
                </Button>
              </>
            )}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
})

export default AddressDrawer
