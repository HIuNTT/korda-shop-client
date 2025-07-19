import WaveIcon from "@/components/icons/WaveIcon"
import { Button } from "@/components/ui/button"
import { QuotePrices as QuotePricesProps } from "@/types/order"
import { formatCurrency } from "@/utils/number"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { SubmitHandler, useFormContext } from "react-hook-form"
import { CreateOrderFormSchema } from "../pages/Order"
import { useCreateOrder } from "../services/createOrder"
import { useNavigate } from "react-router"
import { queryClient } from "@/configs/queryClient"
import { useCart } from "@/stores/cart"
import { PaymentMethodType } from "@/constants/paymentMethodType"
import TransferPayment from "@/modules/payment/components/TransferPayment"
import { paths } from "@/constants/paths"
import { setObjToSearchParams } from "@/utils/url"

interface Props {
  prices: QuotePricesProps
}

export default function QuotePrices({ prices }: Props) {
  const [expanded, setExpanded] = useState<boolean>(false)

  const { selectedIds } = useCart()
  const navigate = useNavigate()

  const form = useFormContext<CreateOrderFormSchema>()

  const createOrder = useCreateOrder()

  const onSubmit: SubmitHandler<CreateOrderFormSchema> = (data) => {
    createOrder.mutate(data, {
      onSuccess: (data) => {
        if (data.payment_method.key === PaymentMethodType.VNPAY && data.payment_url) {
          window.location.href = data.payment_url
        }
        if (data.payment_method.key === PaymentMethodType.COD) {
          queryClient.refetchQueries({ queryKey: ["count-item-in-cart"] })
          const searchParams = {
            order_code: data.order_code,
            message: "Đặt hàng thành công",
            generic: "Cảm ơn quý khách đã mua hàng tại Korda Shop.",
            spec: "Chúng tôi sẽ liên hệ với quý khách trong vòng 5 phút để xác nhận đơn hàng. Xin cảm ơn quý khách đã tin tưởng và ủng hộ Korda Shop",
          }
          selectedIds.clear()
          navigate({
            pathname: paths.order.success.getHref(),
            search: setObjToSearchParams(searchParams),
          })
        }
      },
    })
  }

  return (
    <>
      <div className="sticky top-[125px]">
        <div className="bg-background right-0 flex flex-col gap-3 rounded-t-lg p-4 pb-2 outline-none">
          <div className="flex flex-col gap-2">
            <p className="text-base font-semibold">Thông tin đơn hàng</p>
            <div className="flex items-center justify-between">
              <p className="text-xs">Tổng tiền</p>
              <div className="text-base font-medium">{formatCurrency(prices.total)}</div>
            </div>
            <div className="border-border border-b"></div>
            <div className="flex items-center justify-between">
              <p className="text-xs">Tổng khuyến mãi</p>
              <div className="text-base font-medium">
                {formatCurrency(prices.total_discount + prices.total_voucher_price)}
              </div>
            </div>
            {expanded && (
              <div className="flex flex-col gap-2 pl-3">
                <div className="flex items-center gap-2">
                  <span className="bg-border size-1 rounded-[50%]"></span>
                  <div className="flex w-full items-center justify-between">
                    <p className="text-xs">Giảm giá sản phẩm</p>
                    <div className="text-base font-medium">
                      {formatCurrency(prices.total_discount)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-border size-1 rounded-[50%]"></span>
                  <div className="flex w-full items-center justify-between">
                    <p className="text-xs">Voucher</p>
                    <div className="text-base font-medium">
                      {formatCurrency(prices.total_voucher_price)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <p className="text-xs">Phí vận chuyển</p>
              {prices.estimated_shipping_price > 0 ? (
                <div className="text-base font-medium">
                  {formatCurrency(prices.estimated_shipping_price)}
                </div>
              ) : (
                <div className="text-xs">Miễn phí</div>
              )}
            </div>
            <div className="border-border border-b border-dashed"></div>
            <div className="flex items-center justify-between">
              <p className="text-xs">Cần thanh toán</p>
              <div className="text-primary text-base font-medium">
                {formatCurrency(prices.estimated_price)}
              </div>
            </div>
            <span
              className="text-blue-7 flex cursor-pointer items-center gap-1 text-sm font-medium"
              onClick={() => setExpanded(!expanded)}
            >
              <span>{expanded ? "Rút gọn" : "Xem chi tiết"}</span>
              {expanded ? <ChevronUp className="size-4.5" /> : <ChevronDown className="size-4.5" />}
            </span>
          </div>
          <Button
            size="lg"
            className="mt-3 h-14 text-base"
            isLoading={createOrder.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            Đặt Hàng
          </Button>
          <div className="text-center text-xs">
            <p>Bằng việc tiến hành đặt mua hàng, bạn đồng ý với</p>
            <div>
              <span className="cursor-pointer font-medium underline">Điều khoản dịch vụ</span> và{" "}
              <span className="cursor-pointer font-medium underline">
                Chính sách xử lý dữ liệu cá nhân
              </span>
            </div>
            <p>của Korda Shop</p>
          </div>
        </div>
        <WaveIcon className="text-background w-full" fill="currentColor" />
      </div>

      {createOrder.isSuccess &&
        createOrder.data &&
        createOrder.data.qr_code &&
        createOrder.data.order_code && (
          <TransferPayment
            paymentMethod={createOrder.data.payment_method}
            totalPrice={createOrder.data.total_price}
            qrCode={createOrder.data.qr_code}
            orderCode={createOrder.data.order_code}
          />
        )}
    </>
  )
}
