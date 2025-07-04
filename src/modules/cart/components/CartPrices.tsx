import WaveIcon from "@/components/icons/WaveIcon"
import { Button } from "@/components/ui/button"
import { useCart } from "@/stores/cart"
import { formatCurrency } from "@/utils/number"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export default function CartPrices() {
  const [expanded, setExpanded] = useState<boolean>(false)

  const { prices } = useCart()

  return (
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
        <Button size="lg" className="mt-3 h-14 text-base">
          Mua Hàng
        </Button>
      </div>
      <WaveIcon className="text-background w-full" fill="currentColor" />
    </div>
  )
}
