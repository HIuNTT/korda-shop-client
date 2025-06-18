import { api } from "@/configs/api"
import { useMutation } from "@tanstack/react-query"

interface CreateProductImageDto {
  url: string
  key: string
}

interface CreateProductAttributeDto {
  attribute_id: number
  attribute_values: { option_id?: number; raw_value?: string }[]
}

export interface CreateProductDto {
  name: string
  description: string
  highlight_features: string
  product_state?: string
  included_accessories?: string
  warranty_information?: string
  tax_vat?: boolean
  secondary_name?: string
  related_name?: string
  stock: number
  price: number
  original_price?: number
  category_ids: number[]
  images: CreateProductImageDto[]
  attributes?: CreateProductAttributeDto[]
}

async function createProduct(data: CreateProductDto) {
  return (await api.post("/product", data)).data
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: createProduct,
  })
}
