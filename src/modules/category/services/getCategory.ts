import { api } from "@/configs/api"
import { Category } from "@/types/category"
import { useQuery } from "@tanstack/react-query"

interface GetCategoryTreeParams {
  name?: string
}

export interface CategoryTreeResponse
  extends Pick<Category, "id" | "name" | "order_no" | "slug" | "parent_id"> {
  children?: CategoryTreeResponse[]
}

async function getCategoryTree(params?: GetCategoryTreeParams) {
  return (
    await api.get<API.BaseResponse<CategoryTreeResponse[]>>("/category/get-category-tree", {
      params,
    })
  ).data.data
}

export function useGetCategoryTree(params?: GetCategoryTreeParams) {
  return useQuery({
    queryKey: ["getCategoryTree", params?.name],
    queryFn: () => getCategoryTree(params),
  })
}
