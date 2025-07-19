import { api } from "@/configs/api"
import { QuoteInfo } from "@/types/order"
import { useQuery } from "@tanstack/react-query"

async function getQuote() {
  return (await api.get<API.BaseResponse<QuoteInfo>>("/quote/info")).data.data
}

export function useGetQuote() {
  return useQuery({
    queryKey: ["get-quote"],
    queryFn: getQuote,
  })
}
