import { Link, useSearchParams } from "react-router"
import { useGetOrderInfo } from "../services/getOrderInfo"
import { HiCheckBadge } from "react-icons/hi2"
import { PaymentMethodTitle, PaymentMethodType } from "@/constants/paymentMethodType"
import { formatCurrency } from "@/utils/number"
import { Button } from "@/components/ui/button"
import { paths } from "@/constants/paths"

export default function OrderSuccess() {
  const [query] = useSearchParams()

  const orderCode = query.get("order_code") || ""
  const message = query.get("message")
  const generic = query.get("generic")
  const spec = query.get("spec")

  const getOrderInfo = useGetOrderInfo({ order_code: orderCode }, !!orderCode)

  return (
    getOrderInfo.data && (
      <div className="bg-secondary-background py-4">
        <div className="mx-auto min-h-[calc(100vh-96px)] max-w-[1200px] max-[1200px]:px-4">
          <div className="mt-6 flex justify-center">
            <div className="bg-background w-full max-w-3xl rounded-lg p-10">
              <div className="pb-[10%] md:grid md:grid-cols-3">
                <div className="col-span-1 px-5">
                  <div className="mx-auto max-w-[148px]">
                    <HiCheckBadge className="text-success-6 mx-auto size-full" />
                  </div>
                </div>
                <div className="col-span-2 mt-6 md:mt-0">
                  <div className="ml-5">
                    <div className="mb-3 text-xl font-medium">{message}</div>
                    <div className="bg-success-1 mb-3 rounded-lg px-4 py-3 text-sm">
                      <span className="text-success-8">{generic} </span>
                      <span>{spec}</span>
                    </div>
                    <div className="border-border flex items-center justify-between border-b py-3 text-sm">
                      <div className="text-muted-foreground">Mã đơn hàng</div>
                      <div>{orderCode}</div>
                    </div>
                    <div className="flex items-center justify-between border-b py-3 text-sm">
                      <div className="text-muted-foreground">Phương thức thanh toán</div>
                      <div className="flex items-center gap-1">
                        <img
                          width={32}
                          src={getOrderInfo.data.payment_method.image_url}
                          alt={getOrderInfo.data.payment_method.name}
                        />
                        <span>
                          {
                            PaymentMethodTitle[
                              getOrderInfo.data.payment_method.key as PaymentMethodType
                            ]
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3 text-sm">
                      <div className="text-muted-foreground">Tổng tiền</div>
                      <div>{formatCurrency(getOrderInfo.data.total_price)}</div>
                    </div>
                    <div className="mt-6 flex items-center">
                      <Link className="w-full" to={paths.home.getHref()}>
                        <Button className="w-full" size="lg">
                          Tiếp Tục Mua Sắm
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}
