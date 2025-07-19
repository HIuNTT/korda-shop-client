import { api } from "@/configs/api"
import { CartInfo } from "@/types/cart"
import { useMutation } from "@tanstack/react-query"

interface DeleteCartItemDto {
  ids: string[]
  selected_ids: string[]
}

async function deleteCartItem(data: DeleteCartItemDto) {
  return (await api.post<API.BaseResponse<CartInfo>>("/cart/delete", data)).data.data
}

export function useDeleteCartItem() {
  return useMutation({
    mutationFn: deleteCartItem,
    meta: {
      skipErrorHandle: true,
    },
  })
}
