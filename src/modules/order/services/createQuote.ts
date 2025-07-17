import { api } from "@/configs/api"
import { useMutation } from "@tanstack/react-query"

interface CreateQuoteDto {
  selected_ids: string[]
}

async function createQuote(data: CreateQuoteDto) {
  return (await api.post("/quote/create", data)).data
}

export function useCreateQuote() {
  return useMutation({
    mutationFn: createQuote,
  })
}
