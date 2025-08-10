import { api } from "@/configs/api"
import { OrderStatusType } from "@/constants/order"
import { Order } from "@/types/order"
import { PaymentMethod } from "@/types/payment"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

export interface MyOrderItem {
  item_id: number
  variant_id: number
  quantity: number
  price: number
  original_price: number
  image_url: string
  item_name: string
  stock: number
  variant_name: string
}

export interface MyOrderFlags {
  is_re_buy?: boolean
  is_cancel?: boolean
  is_return?: boolean
  is_review?: boolean
  is_repayment?: boolean
}

export interface GetMyOrderResponse
  extends Pick<
    Order,
    | "id"
    | "code"
    | "subtotal_price"
    | "total_price"
    | "shipping_price"
    | "voucher_price"
    | "created_at"
  > {
  status: OrderStatusType
  count: number
  details: MyOrderItem[]
  flags: MyOrderFlags
}

export interface GetMyOrderListParams {
  page?: number
  take?: number
  type?: OrderStatusType
  keyword?: string
}

export interface MyOrderProducts {
  product_id: number
  variant_id: number
  quantity: number
  price: number
  original_price: number
  image_url: string
  product_name: string
  stock: number
  variant_name: string
  slug: string
}

export interface MyOrderAddress {
  shipping_name: string
  shipping_phone: string
  shipping_address: string
}

export interface MyOrderProcessing {
  create_time: string
  confirm_time?: string
  delivery_time?: string
  complete_time?: string
  is_rated?: boolean
  rating_time?: string
  cancel_time?: string
}

export interface GetMyOrderDetailResponse extends Omit<GetMyOrderResponse, "details" | "count"> {
  note: string | null
  products: MyOrderProducts[]
  address: MyOrderAddress
  payment_method: Omit<PaymentMethod, "is_actived">
  processing: MyOrderProcessing
}

export interface GetMyOrderParams {
  id: string
}

export async function getMyOrderList(params: GetMyOrderListParams) {
  return (
    await api.get<API.BaseResponse<API.BaseGetList<GetMyOrderResponse>>>("/order/my-order", {
      params,
    })
  ).data.data
}

export function useGetMyOrderList({ take = 5, type, keyword }: GetMyOrderListParams) {
  return useInfiniteQuery({
    queryKey: ["get-my-order", take, type, keyword],
    queryFn: ({ pageParam }) => getMyOrderList({ take, type, keyword, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return
      const { current_page, total_pages } = lastPage.meta
      if (current_page < total_pages) return current_page + 1
    },
    placeholderData: undefined,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export async function getMyOrder({ id }: GetMyOrderParams) {
  return (await api.get<API.BaseResponse<GetMyOrderDetailResponse>>(`/order/my-order-detail/${id}`))
    .data.data
}

export function useGetMyOrder({ id }: GetMyOrderParams) {
  return useQuery({
    queryKey: ["get-my-order", id],
    queryFn: async () => await getMyOrder({ id }),
  })
}
