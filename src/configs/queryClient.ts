import { keepPreviousData, MutationCache, QueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

// Define a custom error handling function
function handleError(err: unknown) {
  let message = ""

  if (err instanceof AxiosError) {
    message = err.response?.data?.message || err.message
  } else if (err instanceof Error) {
    message = `Execution error: ${err.message}`
  }

  toast.error(message)
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      placeholderData: keepPreviousData,
    },
    mutations: {
      retry: 0,
      // onError: handleError,
    },
  },
  mutationCache: new MutationCache({
    onError(error, _, __, mutation) {
      if (!mutation.meta?.skipErrorHandle) {
        handleError(error)
      }
    },
  }),
})
