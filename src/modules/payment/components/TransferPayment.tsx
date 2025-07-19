import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PaymentMethodType } from "@/constants/paymentMethodType"
import { formatCurrency } from "@/utils/number"
import { ScanLine } from "lucide-react"
import CountdownRemainingPayment from "./CountdownRemainingPayment"
import { PaymentMethod } from "@/types/payment"
import { useGetOrderPaymentStatus } from "../services/getOrderPaymentStatus"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { setObjToSearchParams } from "@/utils/url"
import { paths } from "@/constants/paths"
import { queryClient } from "@/configs/queryClient"

const appNames: Partial<Record<PaymentMethodType, string>> = {
  [PaymentMethodType.TRANSFER_ONLINE]: "Internet Banking",
  [PaymentMethodType.VNPAY]: "VNPAY",
  [PaymentMethodType.ZALOPAY]: "ZaloPay",
  [PaymentMethodType.MOMO]: "Momo",
}

interface Props {
  paymentMethod: PaymentMethod
  totalPrice: number
  qrCode: string
  orderCode: string
}

export default function TransferPayment({ paymentMethod, totalPrice, qrCode, orderCode }: Props) {
  const getOrderPaymentStatus = useGetOrderPaymentStatus({ orderCode })

  const navigate = useNavigate()

  useEffect(() => {
    if (getOrderPaymentStatus.isSuccess && getOrderPaymentStatus.data.status) {
      const searchParams = {
        order_code: orderCode,
        message: "Đặt hàng thành công",
        generic: "Thanh toán thành công.",
        spec: "Cảm ơn quý khách đã mua hàng tại Korda Shop",
      }
      queryClient.refetchQueries({ queryKey: ["count-item-in-cart"] })
      navigate(
        {
          pathname: paths.order.success.getHref(),
          search: setObjToSearchParams(searchParams),
        },
        {
          replace: true,
        },
      )
    }
  }, [getOrderPaymentStatus.isSuccess, getOrderPaymentStatus.data?.status, orderCode, navigate])

  return (
    <div className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50">
      <Dialog modal={false} open={true} defaultOpen={true}>
        <DialogContent className="gap-0 p-0 sm:max-w-[720px]" showCloseButton={false}>
          <DialogHeader className="flex flex-col items-center justify-between border-b px-6 py-5 sm:flex-row">
            <DialogTitle className="inline-flex items-center gap-2.5 self-start text-[17px] font-medium">
              <img width={32} height={32} src={paymentMethod.image_url} alt={paymentMethod.name} />
              {paymentMethod.name}
            </DialogTitle>
            <DialogDescription className="hidden">{null}</DialogDescription>
            <div className="text-blue-6 cursor-pointer self-end text-sm" title="Hiện chưa khả dụng">
              Đổi phương thức khác
            </div>
          </DialogHeader>
          <div className="flex flex-col gap-10 px-6 py-5 sm:flex-row">
            <div className="bg-content-2 mx-auto w-fit rounded-2xl p-4">
              <div className="overflow-hidden rounded-[8px] [box-shadow:rgba(40,40,43,0.16)_0px_2px_8px] dark:[box-shadow:rgba(235,235,255,0.4)_0px_2px_8px]">
                <img className="size-[224px]" src={qrCode} />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tổng tiền:</span>
                <p className="text-base font-medium">{formatCurrency(totalPrice)}</p>
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <div>
                <div className="mb-5 text-xl font-medium">Quét mã QR để thanh toán</div>

                <div className="text-muted-foreground mb-4 flex items-start gap-2 text-sm">
                  <span className="bg-primary text-primary-foreground size-5 shrink-0 rounded-full text-center">
                    1
                  </span>
                  <p>
                    Mở{" "}
                    <b className="font-medium">
                      ứng dụng {appNames[paymentMethod.key as PaymentMethodType]}
                    </b>{" "}
                    trên điện thoại
                  </p>
                </div>
                <div className="text-muted-foreground mb-4 flex items-start gap-2 text-sm">
                  <span className="bg-primary text-primary-foreground size-5 shrink-0 rounded-full text-center">
                    2
                  </span>
                  <p>
                    Trên{" "}
                    {paymentMethod.key === PaymentMethodType.VNPAY
                      ? "ứng dụng"
                      : appNames[paymentMethod.key as PaymentMethodType]}
                    , chọn biểu tượng
                    <ScanLine className="text-foreground mx-[5px] inline-flex" size={24} />
                    <b>Quét mã QR</b>
                  </p>
                </div>
                <div className="text-muted-foreground mb-4 flex items-start gap-2 text-sm">
                  <span className="bg-primary text-primary-foreground size-5 shrink-0 rounded-full text-center">
                    3
                  </span>
                  <p>Quét mã QR ở trang này và thanh toán</p>
                </div>
              </div>
              <CountdownRemainingPayment orderCode={orderCode} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
