import { DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { GetProductResponse } from "../services/getProduct"
import { X } from "lucide-react"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"
import { FreeMode, Thumbs } from "swiper/modules"
import { useEffect, useRef, useState } from "react"
import { InView } from "react-intersection-observer"
import { cn } from "@/lib/utils"
import { debounce } from "lodash-es"

interface Props {
  data: GetProductResponse["attribute_items"]
}

export default function TechnologyDrawer({ data }: Props) {
  const techContentRef = useRef<HTMLDivElement>(null)
  const swiperRef = useRef<SwiperRef>(null)

  const [inViews, setInViews] = useState<{ [name: number]: boolean }>({ 0: true })
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const handleClickIntoView = (index: number) => {
    const element = techContentRef.current?.querySelector(`#item-${index}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setActiveIndex(index)
  }

  const onChangeInView = (index: number, inView: boolean) => {
    setInViews((prev) => ({ ...prev, [index]: inView }))
  }

  useEffect(() => {
    const debouncedUpdate = debounce(() => {
      const visibleItems = Object.entries(inViews).filter(([_, inView]) => inView)
      if (visibleItems.length > 0) {
        const firstVisibleIndex = parseInt(visibleItems[0][0])
        setActiveIndex(firstVisibleIndex)
        swiperRef.current?.swiper.slideTo(firstVisibleIndex)
      }
    }, 150)

    debouncedUpdate()

    return () => {
      debouncedUpdate.cancel()
    }
  }, [JSON.stringify(inViews)])

  return (
    <DrawerContent className="!w-full !max-w-[600px]">
      <DrawerHeader className="flex flex-row items-center justify-between border-b">
        <DrawerTitle className="text-lg">Thông số kỹ thuật</DrawerTitle>
        <DrawerClose asChild className="cursor-pointer">
          <X />
        </DrawerClose>
      </DrawerHeader>
      <div className="sticky top-0 px-4">
        <Swiper
          ref={swiperRef}
          freeMode={true}
          modules={[FreeMode, Thumbs]}
          slidesPerView="auto"
          className="!bg-background border-b"
          grabCursor={true}
          slideToClickedSlide={true}
          data-vaul-no-drag
        >
          {data.map((att, idx) => (
            <SwiperSlide className="!w-fit" key={idx} onClick={() => handleClickIntoView(idx)}>
              <div
                className={cn(
                  "hover:bg-accent p-3 text-sm font-medium",
                  activeIndex === idx && "border-primary text-primary border-b-2",
                )}
              >
                {att.group_name}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div
        ref={techContentRef}
        className="scrollbar-none flex flex-col overflow-y-scroll px-5 pb-15"
      >
        {data.map((att, idx) => (
          <InView
            as="div"
            key={idx}
            root={techContentRef.current}
            onChange={(inView) => onChangeInView(idx, inView)}
            threshold={0.5}
          >
            {({ ref }) => (
              <div ref={ref} id={`item-${idx}`} key={idx} className="pt-5 select-text">
                <div className="mb-2.5 text-base font-semibold">
                  <span data-vaul-no-drag>{att.group_name}</span>
                </div>
                <Table>
                  <TableBody className="[&_tr:last-child]:border-b">
                    {att.attributes.map((attribute, index) => (
                      <TableRow key={index} className="border-dashed">
                        <TableCell className="text-muted-foreground w-2/5 py-1.5 font-medium whitespace-normal">
                          <span data-vaul-no-drag>{attribute.name}</span>
                        </TableCell>
                        <TableCell className="w-full py-1.5 whitespace-pre-wrap">
                          <span data-vaul-no-drag>{attribute.value}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </InView>
        ))}
        <div style={{ height: "479px" }}></div>
      </div>
    </DrawerContent>
  )
}
