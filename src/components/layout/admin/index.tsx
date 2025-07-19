import { SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router"
import AppSidebar from "./AppSidebar"
import { cn } from "@/lib/utils"
import Header from "./Header"
import Cookies from "js-cookie"

export default function AdminLayout() {
  const defaultOpen = Cookies.get("sidebar_state") !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <div
        className={cn(
          "ml-auto w-full max-w-full",
          "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
          "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
          "sm:transition-[width] sm:duration-200 sm:ease-linear",
          "flex flex-1 flex-col",
        )}
      >
        <Header />
        <main className="px-4 py-4 pb-10">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
