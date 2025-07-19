import { api } from "@/configs/api"
import { useQuery } from "@tanstack/react-query"

interface GetOrderPaymentStatusDto {
  orderCode: string
}

async function getOrderPaymentStatus({ orderCode }: GetOrderPaymentStatusDto) {
  return (await api.get<API.BaseResponse<{ status: boolean }>>(`/order/payment/${orderCode}`)).data
    .data
}

export function useGetOrderPaymentStatus(
  dto: GetOrderPaymentStatusDto,
  enabled?: boolean,
  customeKey?: string,
) {
  return useQuery({
    queryKey: ["order-payment-status", dto.orderCode, customeKey],
    queryFn: () => getOrderPaymentStatus(dto),
    enabled,
    refetchInterval: 2000, // Refetch every 2 seconds
    refetchIntervalInBackground: true, // Continue refetching even when the tab is in the background
  })
}
