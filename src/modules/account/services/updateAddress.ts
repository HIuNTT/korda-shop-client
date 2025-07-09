import { api } from "@/configs/api"
import { CreateAddressDto } from "./createAddress"
import { useMutation } from "@tanstack/react-query"

interface UpdateAddressDto extends CreateAddressDto {
  addressId: number
}

async function updateAddress(data: UpdateAddressDto) {
  const { addressId, ...rest } = data
  return (await api.put(`/account/address/${addressId}`, rest)).data
}

export function useUpdateAddress() {
  return useMutation({
    mutationFn: updateAddress,
  })
}
