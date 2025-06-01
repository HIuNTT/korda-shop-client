import { Suspense } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./configs/queryClient"
import { RouterProvider } from "react-router"
import { router } from "./configs/router"
import { Toaster } from "./components/ui/sonner"
import LoadingPage from "./components/common/LoadingPage"
import { GoogleOAuthProvider } from "@react-oauth/google"
import ThemeProvider from "./context/ThemeProvider"

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ThemeProvider>
          <Suspense fallback={<LoadingPage />}>
            <RouterProvider router={router} />
            <Toaster richColors position="top-center" />
          </Suspense>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  )
}

export default App
