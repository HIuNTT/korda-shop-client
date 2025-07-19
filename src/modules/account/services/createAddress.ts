import { api } from "@/configs/api"
import { Address } from "@/types/address"
import { useMutation } from "@tanstack/react-query"

export interface CreateAddressDto extends Omit<Address, "id" | "full_address"> {}

async function createAddress(data: CreateAddressDto) {
  return (await api.post("/account/address", data)).data
}

export function useCreateAddress() {
  return useMutation({
    mutationFn: createAddress,
  })
}
