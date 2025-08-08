import { orderStatusTabs } from "@/constants/order"
import { useGetMyOrderList } from "../services/getMyOrder"
import { useEffect, useRef, useState } from "react"
import { domMax, LazyMotion, m } from "framer-motion"
import scrollIntoView from "scroll-into-view-if-needed"
import { useTheme } from "@/stores/theme"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { paths } from "@/constants/paths"
import LoadingMyOrder from "../components/my-order/LoadingMyOrder"
import MyOrderItem from "../components/my-order/MyOrderItem"
import { useInView } from "react-intersection-observer"

export default function MyOrder() {
  const [type, setType] = useState<number>()

  const { resolvedTheme } = useTheme()

  const tabsRef = useRef<HTMLDivElement>(null)
  const { ref, inView } = useInView()

  const getMyOrders = useGetMyOrderList({ type })

  useEffect(() => {
    if (inView) {
      getMyOrders.fetchNextPage()
    }
  }, [getMyOrders.fetchNextPage, inView])

  return (
    <div>
      <div
        ref={tabsRef}
        className="bg-background border-border scrollbar-none sticky top-16 z-10 mb-3 flex flex-nowrap items-center overflow-x-scroll rounded-t-lg border-b"
      >
        {orderStatusTabs.map((tab, index) => {
          const tabRef = useRef<HTMLDivElement>(null)

          const isSelected = type === tab.status

          const handleClickTab = () => {
            setType(tab.status)

            if (tabsRef.current && tabRef.current) {
              scrollIntoView(tabRef.current, {
                scrollMode: "if-needed",
                behavior: "smooth",
                block: "end",
                inline: "end",
                boundary: tabsRef.current,
              })
            }

            window.scrollTo(0, 0)
          }

          return (
            <div
              ref={tabRef}
              key={index}
              aria-selected={isSelected}
              className="group relative flex h-12 min-w-[128px] cursor-pointer items-center justify-center py-1 transition-opacity aria-[selected=false]:hover:opacity-70"
              onClick={handleClickTab}
              data-selected={isSelected || undefined}
            >
              <div className="text-foreground/70 group-data-[selected=true]:text-primary text-sm font-medium transition-colors">
                {tab.title}
              </div>
              {isSelected && (
                <LazyMotion features={domMax}>
                  <m.span
                    className="bg-primary absolute bottom-0 h-[2px] w-full"
                    data-slot="cursor"
                    layoutDependency={false}
                    layoutId="cursor"
                    transition={{
                      type: "spring",
                      bounce: 0.15,
                      duration: 0.5,
                    }}
                  />
                </LazyMotion>
              )}
            </div>
          )
        })}
      </div>
      {getMyOrders.isLoading ? (
        <div className="flex flex-col gap-3">
          <LoadingMyOrder />
        </div>
      ) : getMyOrders.data?.pages[0].items.length ? (
        <div className="flex flex-col gap-3">
          {getMyOrders.data.pages.map((page) =>
            page?.items.map((order, idx) => <MyOrderItem key={idx} order={order} />),
          )}
          {getMyOrders.isFetchingNextPage && <LoadingMyOrder />}
          {getMyOrders.hasNextPage && <div ref={ref}></div>}
        </div>
      ) : (
        <div className="bg-background flex flex-col items-center justify-center rounded-md p-9 md:min-h-[calc(100vh-193px)]">
          <img
            className="w-[100px] object-contain md:w-[200px]"
            src={resolvedTheme === "dark" ? "/img/empty-order-dark.png" : "/img/empty-order.png"}
            alt="Empty Order"
          />
          <div className="mt-5 mb-2 font-semibold">Bạn chưa có đơn hàng nào</div>
          <p className="text-muted-foreground mb-5 text-center text-sm">
            Cùng khám phá hàng ngàn sản phẩm tại Korda Shop nhé!
          </p>
          <Link className="rounded-full" to={paths.home.getHref()}>
            <Button className="rounded-full capitalize">Tiếp tục mua sắm</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
