import { api } from "@/configs/api"
import { useQuery } from "@tanstack/react-query"

interface VnpayCheckDto {
  vnp_TmnCode: string
  vnp_Amount: string
  vnp_BankCode: string
  vnp_BankTranNo?: string
  vnp_CardType?: string
  vnp_PayDate?: string
  vnp_OrderInfo: string
  vnp_TransactionNo: string
  vnp_ResponseCode: string
  vnp_TransactionStatus: string
  vnp_TxnRef: string
  vnp_SecureHash: string
}

interface VnpayCheckResponse {
  success: boolean
  message: string
  order_code: string
  generic: string
  spec: string
}

async function vnpayCheck(params: VnpayCheckDto) {
  return (
    await api.get<API.BaseResponse<VnpayCheckResponse>>("/payment/checkout/vnpay-check", { params })
  ).data.data
}

export function useVnpayCheck(params: VnpayCheckDto, enabled?: boolean) {
  return useQuery({
    queryKey: ["vnpay-check", params],
    queryFn: () => vnpayCheck(params),
    enabled,
  })
}
