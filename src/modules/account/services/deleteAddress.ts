import { api } from "@/configs/api"
import { useMutation } from "@tanstack/react-query"

async function deleteAddress(addressId: number) {
  return (await api.delete(`/account/address/${addressId}`)).data
}

export function useDeleteAddress() {
  return useMutation({
    mutationFn: deleteAddress,
  })
}
