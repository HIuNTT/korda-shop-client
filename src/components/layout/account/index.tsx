import { Outlet } from "react-router"
import Breadcrumbs from "../Breadcrumbs"
import NavbarList from "./NavbarList"
import { navAccountData } from "@/constants/navAccount"

export default function AccountLayout() {
  return (
    <div className="bg-secondary-background pb-10">
      <div className="mx-auto min-h-[calc(100vh-64px)] max-w-[1200px] max-[1200px]:px-4">
        <div className="py-4">
          <Breadcrumbs />
        </div>
        <div className="flex flex-col gap-5 md:grid md:grid-cols-3 lg:grid-cols-4">
          <div className="md:col-span-1">
            <div className="bg-background h-full rounded-lg md:max-h-[calc(100vh-132px)] md:min-h-[calc(100vh-132px)]">
              <NavbarList items={navAccountData} />
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
