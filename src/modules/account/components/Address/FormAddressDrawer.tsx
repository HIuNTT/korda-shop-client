import Field from "@/components/core/field"
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
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { AddressType } from "@/constants/addressType"
import { useDisclosure } from "@/hooks/use-disclosure"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { SubmitHandler, useForm, useFormState } from "react-hook-form"
import { z } from "zod/v4"
import { useGetDistricts, useGetProvinces, useGetWards } from "../../services/getLocation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Address } from "@/types/address"
import { isEmpty } from "lodash-es"
import { useCreateAddress } from "../../services/createAddress"
import { toast } from "sonner"
import { useUpdateAddress } from "../../services/updateAddress"
import { queryClient } from "@/configs/queryClient"
import Tooltip from "@/components/common/Tooltip"

export interface FormAddressRef {
  onOpen: () => void
}

interface FormAddressDrawerProps {
  address?: Address
  isDefault?: boolean
}

const formSchema = z.object({
  name: z.string().trim().min(1, "Không được để trống"),
  phone: z
    .string()
    .min(1, "Không được để trống")
    .regex(/(0[3|5|7|8|9])+([0-9]{8})\b/g, "Số điện thoại không đúng định dạng"),
  province_id: z
    .int({
      error: (iss) => {
        if (iss.input === undefined) {
          return "Không được để trống"
        }
      },
    })
    .min(1, "Không được để trống"),
  district_id: z
    .int({
      error: (iss) => {
        if (iss.input === undefined) {
          return "Không được để trống"
        }
      },
    })
    .min(1, "Không được để trống"),
  ward_id: z
    .int({
      error: (iss) => {
        if (iss.input === undefined) {
          return "Không được để trống"
        }
      },
    })
    .min(1, "Không được để trống"),
  address: z.string().trim().min(1, "Không được để trống"),
  type: z.enum(AddressType).default(AddressType.HOME),
  is_default: z.boolean().default(false),
})

const FormAddressDrawer = forwardRef<FormAddressRef, FormAddressDrawerProps>(
  ({ address, isDefault }: FormAddressDrawerProps, ref) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const containerRef = useRef<HTMLDivElement>(null)

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: address?.name || "",
        phone: address?.phone || "",
        province_id: address?.province_id || 0,
        district_id: address?.district_id || 0,
        ward_id: address?.ward_id || 0,
        address: address?.address || "",
        type: address?.type || AddressType.HOME,
        is_default: address?.is_default || false,
      },
    })

    const provinceId = form.watch("province_id")
    const districtId = form.watch("district_id")

    const { dirtyFields } = useFormState({
      control: form.control,
      name: ["province_id", "district_id"],
    })

    const getProvinces = useGetProvinces(isOpen)
    const getDistricts = useGetDistricts({ code: provinceId }, Boolean(provinceId && isOpen))
    const getWards = useGetWards({ code: districtId }, Boolean(districtId && isOpen))

    const createAddress = useCreateAddress()
    const updateAddress = useUpdateAddress()

    useImperativeHandle(ref, () => ({
      onOpen,
    }))

    useEffect(() => {
      if (provinceId && isOpen && dirtyFields.province_id) {
        form.setValue("district_id", 0)
        form.setValue("ward_id", 0)
      }
    }, [provinceId, isOpen])

    useEffect(() => {
      if (districtId && isOpen && dirtyFields.district_id) {
        form.setValue("ward_id", 0)
      }
    }, [districtId, isOpen])

    useEffect(() => {
      if (!isOpen && isEmpty(address)) {
        form.reset()
      }
      if (isOpen && !isEmpty(address)) {
        form.reset({
          name: address.name,
          phone: address.phone,
          province_id: address.province_id,
          district_id: address.district_id,
          ward_id: address.ward_id,
          address: address.address,
          type: address.type,
          is_default: address.is_default,
        })
      }
    }, [isOpen])

    const onSubmit: SubmitHandler<z.output<typeof formSchema>> = (data) => {
      if (isEmpty(address)) {
        createAddress.mutate(data, {
          onSuccess: () => {
            queryClient.refetchQueries({
              queryKey: ["get-address-list"],
            })
            form.reset()
            toast.success("Thêm địa chỉ thành công")
            onClose()
          },
        })
      } else {
        updateAddress.mutate(
          {
            addressId: address.id,
            ...data,
          },
          {
            onSuccess: () => {
              queryClient.refetchQueries({
                queryKey: ["get-address-list"],
              })
              form.reset(data)
              toast.success("Cập nhật địa chỉ thành công")
              onClose()
            },
          },
        )
      }
    }

    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange} direction={isDesktop ? "right" : "bottom"}>
        <DrawerContent
          className="data-[vaul-drawer-direction=bottom]:max-h-[90vh] data-[vaul-drawer-direction=right]:md:max-w-md"
          showGrabber={false}
        >
          <DrawerHeader className="flex flex-row items-center justify-between border-b">
            <DrawerTitle>{isEmpty(address) ? "Thêm địa chỉ" : "Chỉnh sửa địa chỉ"}</DrawerTitle>
            <DrawerDescription></DrawerDescription>
            <DrawerClose asChild className="cursor-pointer" data-vaul-no-drag>
              <X />
            </DrawerClose>
          </DrawerHeader>
          <Form {...form}>
            <div
              ref={containerRef}
              id="container"
              className="flex flex-col gap-4 overflow-auto p-4"
            >
              <div className="flex flex-col gap-4">
                <div className="mb-1 text-base font-semibold">Thông tin người nhận</div>
                <Field
                  t="input"
                  name="name"
                  placeholder="Nhập họ và tên"
                  label="Họ và tên"
                  size="lg"
                  data-vaul-no-drag
                />
                <Field
                  t="input-number"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  label="Số điện thoại"
                  size="lg"
                  data-vaul-no-drag
                  maxLength={10}
                />
                <div className="h-[1px] w-full border border-dashed"></div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="mb-1 text-base font-semibold">Địa chỉ nhận hàng</div>
                <Field
                  t="input-my-select"
                  name="province_id"
                  placeholder="Chọn Tỉnh/Thành phố"
                  label="Tỉnh/Thành phố"
                  searchPlaceholder="Tìm kiếm"
                  notFoundContent="Không tìm thấy kết quả"
                  size="lg"
                  fieldNames={{ label: "name", value: "id" }}
                  options={getProvinces.data || []}
                  data-vaul-no-drag
                  disabled={isEmpty(getProvinces.data)}
                />
                <Field
                  t="input-my-select"
                  name="district_id"
                  placeholder="Chọn Quận/Huyện"
                  label="Quận/Huyện"
                  searchPlaceholder="Tìm kiếm"
                  notFoundContent="Không tìm thấy kết quả"
                  size="lg"
                  data-vaul-no-drag
                  fieldNames={{ label: "name", value: "id" }}
                  options={getDistricts.data || []}
                  disabled={!provinceId || isEmpty(getDistricts.data)}
                />
                <Field
                  t="input-my-select"
                  name="ward_id"
                  placeholder="Chọn Phường/Xã"
                  label="Phường/Xã"
                  searchPlaceholder="Tìm kiếm"
                  notFoundContent="Không tìm thấy kết quả"
                  size="lg"
                  data-vaul-no-drag
                  fieldNames={{ label: "name", value: "id" }}
                  options={getWards.data || []}
                  disabled={!districtId || isEmpty(getWards.data)}
                />
                <Field
                  t="input"
                  name="address"
                  placeholder="Nhập địa chỉ cụ thể"
                  label="Địa chỉ cụ thể"
                  size="lg"
                  data-vaul-no-drag
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start gap-2">
                      <FormLabel className="after:ms-0.5 after:me-2 after:content-[':']">
                        Loại địa chỉ
                      </FormLabel>
                      <FormControl hideError={true}>
                        <div className="flex items-center gap-3">
                          <div
                            tabIndex={0}
                            data-vaul-no-drag
                            className={cn(
                              "flex h-10 w-fit min-w-[60px] cursor-pointer items-center justify-center rounded-md border p-3 text-sm transition-all duration-200",
                              field.value === AddressType.HOME && "bg-primary/20 border-primary/70",
                            )}
                            onClick={() => field.onChange(AddressType.HOME)}
                          >
                            Nhà
                          </div>
                          <div
                            tabIndex={0}
                            data-vaul-no-drag
                            className={cn(
                              "flex h-10 w-fit min-w-[60px] cursor-pointer items-center justify-center rounded-md border p-3 text-sm transition-all duration-200",
                              field.value === AddressType.OFFICE &&
                                "bg-primary/20 border-primary/70",
                            )}
                            onClick={() => field.onChange(AddressType.OFFICE)}
                          >
                            Văn phòng
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="h-[1px] w-full border border-dashed"></div>

                <FormField
                  control={form.control}
                  name="is_default"
                  render={({ field }) => {
                    return isDefault || address?.is_default ? (
                      <Tooltip
                        align="start"
                        content={
                          <div className="md:max-w-[394px]">
                            {isDefault &&
                              "Địa chỉ đầu tiên bạn thêm sẽ được đặt làm địa chỉ mặc định. Vui lòng thêm địa chỉ thứ hai để có thể thay đổi cài đặt này."}
                            {address?.is_default &&
                              "Bạn khổng thể xóa nhãn địa chỉ mặc định. Hãy đặt địa chỉ khác làm địa chỉ mặc định của bạn nhé."}
                          </div>
                        }
                      >
                        <FormItem className="flex w-fit items-center gap-5">
                          <FormLabel
                            data-vaul-no-drag
                            className="pointer-events-none opacity-50 select-none"
                          >
                            Đặt làm địa chỉ mặc định
                          </FormLabel>
                          <FormControl>
                            <Switch
                              size="md"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled
                              className="disabled:cursor-default"
                            />
                          </FormControl>
                        </FormItem>
                      </Tooltip>
                    ) : (
                      <FormItem className="flex w-fit items-center gap-5">
                        <FormLabel data-vaul-no-drag>Đặt làm địa chỉ mặc định</FormLabel>
                        <FormControl>
                          <Switch
                            data-vaul-no-drag
                            size="md"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )
                  }}
                />
              </div>
            </div>
          </Form>
          <DrawerFooter className="py-6 shadow-[0_-1px_5px_0px_rgba(0,0,0,0.1)] dark:shadow-[0_-2px_5px_0px_rgba(255,255,255,0.1)]">
            <Button
              isLoading={createAddress.isPending || updateAddress.isPending}
              onClick={form.handleSubmit(onSubmit)}
            >
              Xác nhận
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  },
)

export default FormAddressDrawer
