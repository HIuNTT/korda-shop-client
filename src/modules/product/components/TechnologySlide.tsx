import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"
import { GetProductResponse } from "../services/getProduct"
import { FreeMode } from "swiper/modules"
import { cn } from "@/lib/utils"
import { useScrollSpy } from "@/hooks/use-scroll-spy"
import scrollIntoView from "scroll-into-view-if-needed"
import { useEffect, useRef } from "react"

interface Props {
  data: GetProductResponse["attribute_items"]
}

export default function TechnologySlide({ data }: Props) {
  const swiperRef = useRef<SwiperRef>(null)

  const activeId = useScrollSpy(
    data.map((_, index) => `[id="item-${index}"]`),
    {
      rootMargin: "0% 0% -80% 0%",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    },
  )

  const handleClickSlide = (index: number) => {
    const element = document.querySelector(`div[id="tech-content"] > div[id="item-${index}"]`)
    if (element) {
      scrollIntoView(element, {
        scrollMode: "always",
        block: "start",
        behavior: "smooth",
        boundary: document.querySelector("#tech-content") as Element,
      })
    }
  }

  useEffect(() => {
    if (!activeId || !swiperRef.current) return

    const index = swiperRef.current?.swiper.slides.findIndex((_, idx) => `item-${idx}` === activeId)
    if (index !== -1) {
      swiperRef.current?.swiper.slideTo(index!)
    }
  }, [activeId, swiperRef.current])

  return (
    <Swiper
      ref={swiperRef}
      freeMode={true}
      modules={[FreeMode]}
      slidesPerView="auto"
      className="!bg-background"
      grabCursor={true}
      data-vaul-no-drag
    >
      {data.map((att, idx) => (
        <SwiperSlide onClick={() => handleClickSlide(idx)} className="!w-fit" key={idx}>
          <div
            className={cn(
              "hover:bg-accent after:bg-primary relative p-3 text-sm font-medium after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:transition-all after:duration-300",
              activeId === `item-${idx}` && "text-primary after:w-full",
            )}
          >
            {att.group_name}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
