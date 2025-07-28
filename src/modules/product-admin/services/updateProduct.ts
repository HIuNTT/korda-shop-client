import { api } from "@/configs/api"
import { CreateProductDto } from "./createProduct"
import { useMutation } from "@tanstack/react-query"

interface UpdateProductDto extends CreateProductDto {
  id: number
}

async function updateProduct({ id, ...data }: UpdateProductDto) {
  return (await api.put(`/product/${id}`, data)).data
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: updateProduct,
  })
}
