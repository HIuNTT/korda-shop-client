import { Checkbox } from "@/components/ui/checkbox"
import { paths } from "@/constants/paths"
import { CartProduct } from "@/types/cart"
import { HiOutlineTrash } from "react-icons/hi2"
import { Link } from "react-router"
import VariantsPopover from "./VariantsPopover"
import { debounce, isEmpty } from "lodash-es"
import { formatCurrency } from "@/utils/number"
import { Minus, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useRef } from "react"
import { useUpdateCartItemQuantity } from "../services/updateCartItemQuantity"
import { useCart } from "@/stores/cart"
import { toast } from "sonner"
import { queryClient } from "@/configs/queryClient"
import { useDeleteCartItem } from "../services/deleteCartItem"
import ConfirmDialog, { ConfirmDialogRef } from "@/components/common/ConfirmDialog"

interface Props {
  data: CartProduct
}

export default function CartItem({ data }: Props) {
  const form = useForm({
    defaultValues: {
      quantity: data.quantity,
    },
  })

  const confirmDialogRef = useRef<ConfirmDialogRef>(null)

  const { selectedIds, updateCart, setPrices, toggleSelection } = useCart()

  const updateCartItemQuantity = useUpdateCartItemQuantity()
  const deleteCartItem = useDeleteCartItem()

  const debouncedUpdate = useCallback(
    debounce((itemId: string, quantity: number) => {
      updateCartItemQuantity.mutate(
        {
          item: {
            item_id: itemId,
            quantity: quantity,
          },
          selected_ids: [...selectedIds],
        },
        {
          onSuccess: (data) => {
            queryClient.refetchQueries({
              queryKey: ["count-item-in-cart"],
            })
            if (data.products) {
              updateCart(data.products)
            }
            setPrices(data.prices)
          },
        },
      )
    }, 500),
    [selectedIds],
  )

  const increaseQuantity = (currQuantity: number) => {
    form.setValue("quantity", currQuantity + 1)
    return form.getValues("quantity")
  }

  const decreaseQuantity = (currQuantity: number) => {
    form.setValue("quantity", currQuantity - 1)
    return form.getValues("quantity")
  }

  const handleDeleteItem = (itemId: string) => {
    deleteCartItem.mutate(
      {
        ids: [itemId],
        selected_ids: [...selectedIds],
      },
      {
        onSuccess: (data) => {
          selectedIds.delete(itemId)
          queryClient.refetchQueries({
            queryKey: ["count-item-in-cart"],
          })
          confirmDialogRef.current?.onClose()
          if (data.products) {
            updateCart(data.products)
          }
          setPrices(data.prices)
        },
        onError: () => {
          confirmDialogRef.current?.onClose()
        },
      },
    )
  }

  useEffect(() => {
    form.reset({ quantity: data.quantity })
  }, [data.quantity])

  useEffect(() => {
    debouncedUpdate.cancel()
  }, [debouncedUpdate])

  return (
    <>
      <FormProvider {...form}>
        <div className="bg-background rounded-lg p-4 md:p-5">
          <div className="flex w-full items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 max-md:self-start md:gap-4">
              <Checkbox
                checked={selectedIds.has(data.id)}
                onCheckedChange={(checked) => toggleSelection(data.id, !!checked)}
              />
              <Link
                to={`${paths.product.getHref()}/${data.slug}?variant_id=${data.variant_id}`}
                className="dark:border-primary flex size-16 items-center justify-center overflow-hidden rounded-md border md:size-20"
              >
                <img className="object-contain" src={data.image} alt={data.name} />
              </Link>
            </div>
            <div className="flex w-full justify-between gap-2 max-md:flex-col md:items-center md:gap-4">
              <div className="grid gap-1">
                <div className="line-clamp-2 flex items-start justify-between gap-3 md:gap-1">
                  <Link
                    to={`${paths.product.getHref()}/${data.slug}?variant_id=${data.variant_id}`}
                    className="line-clamp-2 text-sm font-medium md:text-base"
                  >
                    {data.name}
                  </Link>
                  <button
                    className="text-muted-foreground md:hidden"
                    onClick={confirmDialogRef.current?.onOpen}
                  >
                    <HiOutlineTrash size={20} />
                  </button>
                </div>
                {!isEmpty(data.variants) && (
                  <VariantsPopover
                    data={data.variants}
                    activeId={data.variant_id}
                    itemId={data.id}
                  />
                )}
              </div>
              <div className="flex gap-6">
                <div className="flex flex-1 items-center justify-between gap-6">
                  <div className="flex items-end gap-2 md:flex-col md:items-end md:gap-1">
                    <span className="text-primary text-sm font-semibold md:text-base">
                      {formatCurrency(data.price)}
                    </span>
                    {data.original_price > 0 && (
                      <span className="text-muted-foreground text-xs md:text-sm">
                        <del>{formatCurrency(data.original_price)}</del>
                      </span>
                    )}
                  </div>
                  <div className="inline-flex max-h-fit items-center justify-center rounded-sm border">
                    <span
                      className={cn(
                        "flex size-8 cursor-pointer items-center justify-center pr-[3px] pl-1",
                        form.watch("quantity") === 1 && "cursor-not-allowed opacity-50",
                      )}
                      onClick={() => {
                        if (form.getValues("quantity") > 1) {
                          const newQuantity = decreaseQuantity(form.getValues("quantity"))
                          debouncedUpdate(data.id, newQuantity)
                        } else {
                          return
                        }
                      }}
                    >
                      <Minus width={16} />
                    </span>
                    <Controller
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <Input
                          {...field}
                          size="sm"
                          inputClass="text-center"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = parseInt(e.target.value, 10) || 1
                            field.onChange(value)
                            if (value <= data.stock) {
                              debouncedUpdate(data.id, value)
                            } else {
                              toast.error("Đã vượt quá số lượng hàng trong kho")
                              debouncedUpdate.cancel()
                            }
                          }}
                          className="focus-within:border-border w-10 rounded-none border-0 border-x px-1.5 focus-within:ring-0"
                        />
                      )}
                    />
                    <span
                      className={cn(
                        "flex size-8 cursor-pointer items-center justify-center pr-[3px] pl-1",
                        form.watch("quantity") === data.stock && "cursor-not-allowed opacity-50",
                      )}
                      onClick={() => {
                        if (form.getValues("quantity") < data.stock) {
                          const newQuantity = increaseQuantity(form.getValues("quantity"))
                          debouncedUpdate(data.id, newQuantity)
                        } else {
                          return
                        }
                      }}
                    >
                      <Plus width={16} />
                    </span>
                  </div>
                </div>
                <div className="text-muted-foreground hidden md:flex md:items-center">
                  <button onClick={confirmDialogRef.current?.onOpen}>
                    <HiOutlineTrash size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormProvider>

      <ConfirmDialog
        ref={confirmDialogRef}
        body={
          <div className="flex flex-col items-center gap-2">
            <img width={80} height={80} src="/img/warning_mascot.png" alt="warning" />
            <p className="text-center text-base font-semibold">
              Bạn chắc chắn muốn xóa sản phẩm <br /> này ra khỏi giỏ hàng?
            </p>
          </div>
        }
        title={<span className="text-destructive">Xác Nhận Xóa</span>}
        btnAcceptProps={{
          children: "Xóa",
          onClick: () => handleDeleteItem(data.id),
          type: "submit",
          isLoading: deleteCartItem.isPending,
        }}
        className="sm:max-w-[400px]"
      />
    </>
  )
}
