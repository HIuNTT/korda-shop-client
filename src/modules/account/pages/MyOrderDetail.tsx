import { Link, useNavigate, useParams } from "react-router"
import { MyOrderParams } from "../route"
import { useGetMyOrder } from "../services/getMyOrder"
import { ChevronLeft } from "lucide-react"
import { orderStatusDetails, orderSteps } from "@/constants/order"
import { IoIosCopy } from "react-icons/io"
import { FaLocationDot } from "react-icons/fa6"
import Tooltip from "@/components/common/Tooltip"
import { BsExclamationDiamondFill } from "react-icons/bs"
import { formatCurrency } from "@/utils/number"
import { paths } from "@/constants/paths"
import { isBoolean, isEmpty } from "lodash-es"
import { Button } from "@/components/ui/button"
import { paymentMethodTitle } from "@/constants/paymentMethodType"
import OrderSteps, { Step } from "../components/my-order/OrderSteps"
import { useMemo } from "react"
import { formatToDate } from "@/utils/date"
import { Skeleton } from "@/components/ui/skeleton"

export default function MyOrderDetail() {
  const { id = "" } = useParams<keyof MyOrderParams>()
  const navigate = useNavigate()

  const { data: order, isLoading } = useGetMyOrder({ id })

  const steps = useMemo<Step[]>(() => {
    if (order) {
      let status: Step["status"] = "finish"

      return orderSteps.map(({ title, icon, key, finishTitle }) => {
        const mergedTitle = typeof title === "function" ? title(order.payment_method.key) : title
        const subTitle = order.processing[key]
        const mergedFinishTitle =
          typeof finishTitle === "function" ? finishTitle(order.payment_method.key) : finishTitle

        if (!subTitle && status === "process") {
          status = "wait"
        }

        if (!subTitle && status === "finish") {
          status = "process"
        }

        return {
          title: subTitle ? mergedFinishTitle || mergedTitle : mergedTitle,
          icon,
          subTitle: subTitle && formatToDate(subTitle, "hh:mm DD-MM-YYYY"),
          status: status,
        }
      })
    } else {
      return []
    }
  }, [order?.processing])

  return isLoading ? (
    <div className="flex flex-col gap-2 md:gap-3">
      <div>
        <div className="bg-background flex items-center justify-between gap-2 rounded-t-[12px] border-b p-4">
          <Skeleton className="h-4 w-20 rounded" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-40 rounded" />
            <span className="bg-content-4 size-1 rounded-full"></span>
            <Skeleton className="h-4 w-32 rounded" />
          </div>
        </div>
        <div className="bg-background border-b px-4 py-10">
          <div className="flex w-full">
            {Array(5)
              .fill("")
              .map((_, index) => (
                <div key={index} className="flex flex-1 flex-col items-center">
                  <Skeleton className="mx-auto size-15 rounded-full" />
                  <Skeleton className="mt-5 mb-1 h-4 w-full max-w-32 rounded" />
                  <Skeleton className="h-4 w-full max-w-20 rounded" />
                </div>
              ))}
          </div>
        </div>
        <div className="bg-background rounded-b-[12px] p-4">
          <Skeleton className="mb-4 h-6 w-60 rounded" />
          <Skeleton className="mb-2 h-5 w-40 rounded" />
          <Skeleton className="mb-2 h-10 w-1/2 rounded" />
          <Skeleton className="h-10 w-1/3 rounded" />
        </div>
      </div>
      <div className="bg-background rounded-[12px] p-4">
        <Skeleton className="mb-4 h-6 w-60 rounded" />
        <div className="mb-3 border-b">
          {Array(5)
            .fill("")
            .map((_, idx) => (
              <div className="flex items-center gap-3 py-3 not-first:border-t" key={idx}>
                <Skeleton className="size-14 rounded md:size-16" />
                <div className="flex grow flex-col gap-1">
                  <Skeleton className="h-4 w-full rounded md:w-64" />
                  <Skeleton className="h-4 w-10 rounded md:w-24" />
                  <Skeleton className="h-4 w-8 rounded" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              </div>
            ))}
        </div>
        <div className="flex flex-col gap-2 md:gap-3">
          <div className="flex items-center justify-between gap-1 sm:justify-end">
            <Skeleton className="h-4 w-40 rounded" />
            <div className="sm:w-full sm:max-w-[250px]">
              <Skeleton className="ml-auto h-4 w-30 rounded" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1 sm:justify-end">
            <Skeleton className="h-4 w-50 rounded" />
            <div className="sm:w-full sm:max-w-[250px]">
              <Skeleton className="ml-auto h-4 w-20 rounded" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1 sm:justify-end">
            <Skeleton className="h-4 w-40 rounded" />
            <div className="sm:w-full sm:max-w-[250px]">
              <Skeleton className="ml-auto h-4 w-30 rounded" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1 sm:justify-end">
            <Skeleton className="h-4 w-50 rounded" />
            <div className="sm:w-full sm:max-w-[250px]">
              <Skeleton className="ml-auto h-4 w-20 rounded" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1 sm:justify-end">
            <Skeleton className="h-4 w-40 rounded" />
            <div className="sm:w-full sm:max-w-[250px]">
              <Skeleton className="ml-auto h-4 w-40 rounded" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1 sm:justify-end">
            <Skeleton className="h-4 w-30 rounded" />
            <div className="sm:w-full sm:max-w-[250px]">
              <Skeleton className="ml-auto h-7 w-30 rounded" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1 border-t border-dashed pt-3 sm:justify-end">
            <Skeleton className="h-4 w-40 rounded" />
            <div className="sm:w-full sm:max-w-[250px]">
              <div className="flex items-center justify-end gap-1">
                <Skeleton className="size-8 rounded" />
                <Skeleton className="h-4 w-40 rounded" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3 [border-image:repeating-linear-gradient(90deg,var(--border)_0px,var(--border)_10px,transparent_10px,transparent_15px)_1]">
          <Skeleton className="h-4 w-25 rounded md:w-64" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  ) : (
    order && (
      <div className="flex flex-col gap-2 md:gap-3">
        <div>
          <div className="bg-background flex items-center justify-between gap-2 rounded-t-[12px] border-b px-4 py-3 pb-4">
            <div
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-sm transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="font-medium">Quay Lại</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm">
                MÃ ĐƠN HÀNG: {order.code}{" "}
                <Tooltip side="bottom" content="Sao chép">
                  <span className="text-primary cursor-pointer">
                    <IoIosCopy size={16} />
                  </span>
                </Tooltip>
              </div>
              <span className="bg-content-4 size-1 rounded-full"></span>
              <span className="text-primary text-sm">
                {orderStatusDetails[order.status].toUpperCase()}
              </span>
            </div>
          </div>
          <div className="bg-background border-b px-4 py-10">
            <OrderSteps items={steps} />
          </div>
          <div className="bg-background rounded-b-[12px] px-4 py-3">
            <div className="mb-3 text-base font-semibold md:text-lg">Thông Tin Nhận Hàng</div>
            <div className="flex gap-3">
              <div className="text-primary-6 flex items-center">
                <FaLocationDot />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-end gap-2">
                  <span className="font-medium">{order.address.shipping_name}</span>
                  <span className="text-muted-foreground text-sm">
                    {order.address.shipping_phone}
                  </span>
                </div>
                <div className="text-sm md:text-base">{order.address.shipping_address}</div>
              </div>
            </div>
            {order.note && (
              <div className="mt-3 flex items-center gap-3">
                <div className="text-gold-6">
                  <BsExclamationDiamondFill />
                </div>
                <div className="text-sm md:text-base">
                  <span className="font-medium">Lời nhắn:</span> {order.note}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-background rounded-[12px] p-4">
          <div className="mb-4 text-base font-semibold">Danh sách sản phẩm</div>
          <div className="mb-3 border-b">
            {order.products.map((item, idx) => (
              <Link
                to={`${paths.product.getHref()}/${item.slug}?variant_id=${item.variant_id}`}
                className="flex items-center gap-3 py-3 not-first:border-t"
                key={idx}
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded border p-1.5 md:size-16">
                  <img src={item.image_url} alt="Product name" className="object-contain" />
                </div>
                <div className="flex flex-1 flex-wrap justify-between md:flex-nowrap md:gap-2">
                  <div className="flex grow flex-col gap-1">
                    <div
                      className="line-clamp-1 text-sm font-medium md:text-base"
                      title={item.product_name}
                    >
                      {item.product_name}
                    </div>
                    <div className="flex gap-1 max-md:justify-between md:flex-col">
                      <div className="text-muted-foreground text-xs md:text-sm">
                        Màu: {item.variant_name}
                      </div>
                      <div className="max-md:text-muted-foreground grow text-right text-xs md:text-left md:text-sm">{`x${item.quantity}`}</div>
                    </div>
                  </div>
                  <div className="flex items-end justify-end gap-1 text-right max-md:w-full md:flex-col md:justify-center">
                    <div className="text-primary text-sm font-medium max-md:order-2 md:text-base">
                      {formatCurrency(item.price)}
                    </div>
                    <div className="text-muted-foreground text-xs line-through md:text-sm">
                      {formatCurrency(item.original_price)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 text-sm md:gap-3">
            <div className="flex items-center justify-between gap-1 text-right sm:justify-end">
              <div className="text-muted-foreground max-sm:text-left">Tổng tiền hàng</div>
              <div className="sm:w-full sm:max-w-[250px]">
                {formatCurrency(order.subtotal_price)}
              </div>
            </div>
            <div className="flex items-center justify-between gap-1 text-right sm:justify-end">
              <div className="text-muted-foreground max-sm:text-left">Giảm giá voucher</div>
              <div className="text-success-7 sm:w-full sm:max-w-[250px]">
                -{formatCurrency(order.voucher_price)}
              </div>
            </div>
            <div className="flex items-center justify-between gap-1 text-right sm:justify-end">
              <div className="text-muted-foreground max-sm:text-left">Phí vận chuyển</div>
              <div className="sm:w-full sm:max-w-[250px]">
                {order.shipping_price === 0 ? "Miễn phí" : formatCurrency(order.shipping_price)}
              </div>
            </div>
            <div className="flex items-center justify-between gap-1 text-right sm:justify-end">
              <div className="font-medium max-sm:text-left">Thành tiền</div>
              <div className="text-primary-6 text-lg font-semibold sm:w-full sm:max-w-[250px]">
                {formatCurrency(order.total_price)}
              </div>
            </div>
            <div className="flex items-center justify-between gap-1 border-t border-dashed pt-3 text-right sm:justify-end">
              <div className="font-medium max-sm:text-left">Phương thức thanh toán</div>
              <div className="sm:w-full sm:max-w-[250px]">
                <div className="flex items-center justify-end gap-1">
                  <img
                    width={32}
                    src={order.payment_method.image_url}
                    alt={order.payment_method.name}
                  />
                  <div>{paymentMethodTitle[order.payment_method.key]}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3 [border-image:repeating-linear-gradient(90deg,var(--border)_0px,var(--border)_10px,transparent_10px,transparent_15px)_1]">
            <div className="max-w-100"></div>
            <div className="flex items-center gap-2">
              {isEmpty(order.flags) ? null : (
                <>
                  {isBoolean(order.flags.is_re_buy) && (
                    <Button disabled={!order.flags.is_re_buy}>Mua Lại</Button>
                  )}
                  {isBoolean(order.flags.is_repayment) && (
                    <Button disabled={!order.flags.is_repayment}>Thanh Toán Lại</Button>
                  )}
                  {isBoolean(order.flags.is_return) && (
                    <Button variant="outline" disabled={!order.flags.is_return}>
                      Trả Hàng/Hoàn Tiền
                    </Button>
                  )}
                  {isBoolean(order.flags.is_cancel) && (
                    <Button variant="outline" disabled={!order.flags.is_cancel}>
                      Hủy Đơn Hàng
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  )
}
