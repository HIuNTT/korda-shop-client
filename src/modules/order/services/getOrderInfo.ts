import { api } from "@/configs/api"
import { Order } from "@/types/order"
import { useQuery } from "@tanstack/react-query"

interface GetOrderInfoParams {
  order_code: string
}

async function getOrderInfo(params: GetOrderInfoParams) {
  return (await api.get<API.BaseResponse<Order>>("/order/info", { params })).data.data
}

export function useGetOrderInfo(params: GetOrderInfoParams, enabled?: boolean) {
  return useQuery({
    queryKey: ["get-order-info", params.order_code],
    queryFn: () => getOrderInfo(params),
    enabled,
  })
}
