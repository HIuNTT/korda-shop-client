import { api } from "@/configs/api"
import { useMutation } from "@tanstack/react-query"

interface CreateOrderDto {
  address_id: number
  note?: string
  payment_method_id: number
  quote_id: string
}

export interface CreateOrderRes {
  order_code: string
  payment_method: string
  payment_url?: string
  qr_code?: string
}

async function createOrder(data: CreateOrderDto) {
  return (await api.post<API.BaseResponse<CreateOrderRes>>("/order/create", data)).data.data
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
  })
}
