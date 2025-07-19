import { Spinner } from "@/components/ui/spinner"
import { PaymentTypeParams } from "@/modules/order/route"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { useVnpayCheck } from "../services/vnpayCheck"
import { useEffect } from "react"
import { PaymentMethodType } from "@/constants/paymentMethodType"
import { paths } from "@/constants/paths"
import { toast } from "sonner"
import { setObjToSearchParams } from "@/utils/url"

export default function PaymentCallback() {
  const { paymentType } = useParams<keyof PaymentTypeParams>()
  const [query] = useSearchParams()
  const navigate = useNavigate()

  const vnpayCheck = useVnpayCheck(
    {
      vnp_Amount: query.get("vnp_Amount") || "",
      vnp_BankCode: query.get("vnp_BankCode") || "",
      vnp_BankTranNo: query.get("vnp_BankTranNo") || "",
      vnp_CardType: query.get("vnp_CardType") || "",
      vnp_OrderInfo: query.get("vnp_OrderInfo") || "",
      vnp_PayDate: query.get("vnp_PayDate") || "",
      vnp_ResponseCode: query.get("vnp_ResponseCode") || "",
      vnp_TmnCode: query.get("vnp_TmnCode") || "",
      vnp_TransactionNo: query.get("vnp_TransactionNo") || "",
      vnp_TransactionStatus: query.get("vnp_TransactionStatus") || "",
      vnp_SecureHash: query.get("vnp_SecureHash") || "",
      vnp_TxnRef: query.get("vnp_TxnRef") || "",
    },
    query.toString() !== "" && paymentType === PaymentMethodType.VNPAY,
  )

  useEffect(() => {
    if (vnpayCheck.data) {
      const { success, ...rest } = vnpayCheck.data

      if (success) {
        navigate(
          {
            pathname: paths.order.success.getHref(),
            search: setObjToSearchParams(rest),
          },
          {
            replace: true,
          },
        )
      } else {
        navigate(
          {
            pathname: paths.order.failure.getHref(),
            search: setObjToSearchParams(rest),
          },
          {
            replace: true,
          },
        )
      }
    }
  }, [vnpayCheck.data, vnpayCheck.isLoading, navigate])

  useEffect(() => {
    if (vnpayCheck.isError) {
      toast.error((vnpayCheck.error as any).response?.data?.message || "Lỗi không xác định")
      navigate(paths.home.getHref(), { replace: true })
    }
  }, [vnpayCheck.isError])

  return (
    <div className="bg-secondary-background py-4">
      <div className="mx-auto flex min-h-[calc(100vh-96px)] max-w-[1200px] items-center justify-center max-[1200px]:px-4">
        <div className="h-full">
          <Spinner />
        </div>
      </div>
    </div>
  )
}
