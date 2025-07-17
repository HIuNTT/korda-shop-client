import { api } from "@/configs/api"
import { useMutation } from "@tanstack/react-query"

interface CreateOrderDto {
  address_id: number
  note?: string
  payment_method_id: number
  quote_id: string
}

async function createOrder(data: CreateOrderDto) {
  return (await api.post("/order/create", data)).data
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
  })
}
