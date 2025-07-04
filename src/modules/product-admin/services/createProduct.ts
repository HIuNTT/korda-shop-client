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

interface CreateProductVariantValueDto {
  variant_id: number
  original_price?: number
  price: number
  stock: number
  index_map: number[]
  image?: CreateProductImageDto
}

interface CreateProductVariationListDto {
  type_id: number
  custom_value: string
  value_list: { value_id: number; custom_value: string }[]
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
  group_id?: number
  category_ids: number[]
  images: CreateProductImageDto[]
  attributes?: CreateProductAttributeDto[]
  variant_values: CreateProductVariantValueDto[]
  variation_list: CreateProductVariationListDto[]
}

async function createProduct(data: CreateProductDto) {
  return (await api.post("/product", data)).data
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: createProduct,
  })
}
