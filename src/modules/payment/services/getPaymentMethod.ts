import { api } from "@/configs/api"
import { PaymentMethod } from "@/types/payment"
import { useQuery } from "@tanstack/react-query"

async function getPaymentMethod() {
  return (await api.get<API.BaseResponse<PaymentMethod[]>>("/payment/method")).data.data
}

export function useGetPaymentMethod() {
  return useQuery({
    queryKey: ["get-payment-method"],
    queryFn: getPaymentMethod,
  })
}
