import { formatToDate } from "@/utils/date"
import { MyOrderResponse } from "../../services/getMyOrder"
import { orderStatusTitles } from "@/constants/order"
import { formatCurrency } from "@/utils/number"
import { Button } from "@/components/ui/button"
import { isBoolean, isEmpty } from "lodash-es"

interface Props {
  order: MyOrderResponse
}

export default function MyOrderItem({ order }: Props) {
  return (
    <div className="bg-background rounded-md px-4 py-3">
      <div className="flex items-center justify-between gap-2 border-b pb-3">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold">{formatToDate(order.created_at)}</div>
          <span className="bg-content-3 size-1 rounded-full max-md:hidden"></span>
          <div className="text-sm max-md:hidden">{`${order.count} sản phẩm`}</div>
        </div>
        <div className="text-primary text-sm font-medium">
          {orderStatusTitles[order.status].toUpperCase()}
        </div>
      </div>
      <div className="border-b">
        {order.details.map((item, index) => (
          <div className="flex items-center gap-3 py-3 not-first:border-t" key={index}>
            <div className="flex size-14 shrink-0 items-center justify-center rounded border p-1.5 md:size-16">
              <img src={item.image_url} alt="Product name" className="object-contain" />
            </div>
            <div className="flex flex-1 flex-wrap justify-between md:flex-nowrap md:gap-2">
              <div className="flex grow flex-col gap-1">
                <div
                  className="line-clamp-1 text-sm font-medium md:text-base"
                  title={item.item_name}
                >
                  {item.item_name}
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
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2.5 py-3">
        <span className="text-sm">Thành tiền:</span>
        <span className="text-primary text-base font-medium md:text-xl">
          {formatCurrency(order.total_price)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 border-t pt-3 [border-image:repeating-linear-gradient(90deg,var(--border)_0px,var(--border)_10px,transparent_10px,transparent_15px)_1]">
        <div className="max-w-100"></div>
        <div className="flex items-center gap-2">
          {isEmpty(order.flags) ? null : (
            <>
              {isBoolean(order.flags.is_re_buy) && (
                <Button disabled={!order.flags.is_re_buy}>Mua lại</Button>
              )}
              {isBoolean(order.flags.is_repayment) && (
                <Button disabled={!order.flags.is_repayment}>Thanh toán lại</Button>
              )}
              {isBoolean(order.flags.is_return) && (
                <Button variant="outline" disabled={!order.flags.is_return}>
                  Trả hàng/Hoàn tiền
                </Button>
              )}
              {isBoolean(order.flags.is_cancel) && (
                <Button variant="outline" disabled={!order.flags.is_cancel}>
                  Hủy đơn
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
