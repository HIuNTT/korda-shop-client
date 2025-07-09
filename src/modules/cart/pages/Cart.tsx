import Breadcrumbs from "@/components/core/Breadcrumbs"
import { useGetCartInfo } from "../services/getCartInfo"
import { Checkbox } from "@/components/ui/checkbox"
import { HiOutlineTrash } from "react-icons/hi2"
import { isEmpty } from "lodash-es"
import CartItem from "../components/CartItem"
import { useCart } from "@/stores/cart"
import { useEffect, useRef } from "react"
import CartPrices from "../components/CartPrices"
import { useToggleItem } from "../services/toggleItem"
import { cn } from "@/lib/utils"
import { useDeleteCartItem } from "../services/deleteCartItem"
import { queryClient } from "@/configs/queryClient"
import ConfirmDialog, { ConfirmDialogRef } from "@/components/common/ConfirmDialog"
import CartLoading from "../components/CartLoading"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import { paths } from "@/constants/paths"

export default function Cart() {
  const { cart, setCart, updateCart, setPrices, selectedIds, toggleAllSelection, clearPrices } =
    useCart()

  const navigate = useNavigate()

  const confirmDialogRef = useRef<ConfirmDialogRef>(null)

  const getCartInfo = useGetCartInfo()
  const toggleItem = useToggleItem()
  const deleteCartItems = useDeleteCartItem()

  const handleDeleteCartItems = () => {
    if (isEmpty(selectedIds)) return
    deleteCartItems.mutate(
      {
        ids: [...selectedIds],
        selected_ids: [],
      },
      {
        onSuccess: (data) => {
          selectedIds.clear()
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
    if (getCartInfo.data) {
      setCart({
        products: getCartInfo.data.products,
      })
      setPrices(getCartInfo.data.prices)
    }
  }, [getCartInfo.data])

  useEffect(() => {
    if (!isEmpty(selectedIds)) {
      toggleItem.mutate(
        {
          selected_ids: [...selectedIds],
        },
        {
          onSuccess: (data) => {
            if (data.products) {
              updateCart(data.products)
            }
            setPrices(data.prices)
          },
        },
      )
    } else {
      clearPrices()
    }
  }, [selectedIds])

  return (
    <div>
      <Breadcrumbs isLoading={getCartInfo.isFetching} name="Giỏ hàng" />
      <div className="bg-secondary-background py-4">
        <div className="mx-auto min-h-[calc(100vh-100px)] max-w-[1200px] max-[1200px]:px-4">
          {getCartInfo.isFetching ? (
            <CartLoading />
          ) : !isEmpty(cart.products) && getCartInfo.data ? (
            <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="grid gap-y-1.5 md:gap-y-2">
                  <div className="bg-background flex items-center justify-between rounded-lg px-4 py-2 md:px-5 md:py-2.5">
                    <div className="flex h-6 items-center gap-2 md:gap-3">
                      <Checkbox
                        checked={
                          selectedIds.size === cart.products.length ||
                          (selectedIds.size > 0 &&
                            selectedIds.size < cart.products.length &&
                            "indeterminate")
                        }
                        onCheckedChange={toggleAllSelection}
                      />
                      <span className="text-sm font-medium">{`Chọn tất cả (${selectedIds.size})`}</span>
                    </div>
                    <button
                      className={cn(
                        "text-muted-foreground",
                        selectedIds.size === 0 && "cursor-not-allowed opacity-50",
                      )}
                      disabled={selectedIds.size === 0}
                      onClick={confirmDialogRef.current?.onOpen}
                      title="Xóa sản phẩm đã chọn"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </div>
                  {cart.products.map((item, idx) => (
                    <CartItem data={item} key={idx} />
                  ))}
                </div>
              </div>
              <div className="md:col-span-1">
                <CartPrices />
              </div>
            </div>
          ) : (
            <div className="bg-background flex flex-col items-center gap-4 rounded-lg p-10">
              <img width={200} height={200} src="/img/empty-cart.png" alt="Empty cart" />
              <div className="flex flex-col items-center gap-2">
                <div className="text-2xl font-bold">Giỏ hàng trống</div>
                <div className="text-center">
                  Cùng nhau khám phá hàng ngàn sản phẩm ở KordaShop nhé!
                </div>
              </div>
              <Button
                size="lg"
                className="text-base font-semibold"
                onClick={() => navigate(paths.home.getHref())}
              >
                Mua Sắm Ngay
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        ref={confirmDialogRef}
        body={
          <div className="flex flex-col items-center gap-2">
            <img width={80} height={80} src="/img/warning_mascot.png" alt="warning" />
            <p className="text-center text-base font-semibold">
              Bạn chắc chắn muốn xóa sản phẩm <br /> đã chọn ra khỏi giỏ hàng?
            </p>
          </div>
        }
        title={<span className="text-destructive">Xác Nhận Xóa</span>}
        btnAcceptProps={{
          children: "Xóa",
          onClick: handleDeleteCartItems,
          isLoading: deleteCartItems.isPending,
        }}
        className="sm:max-w-[400px]"
      />
    </div>
  )
}
