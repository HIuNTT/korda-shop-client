import { useState } from "react"
import { GetProductResponse } from "../services/getProduct"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper as SwiperType } from "swiper/types"

interface Props {
  data: GetProductResponse["images"]
}

export default function Gallery({ data }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType>()

  return (
    <div>
      <Swiper
        className="group/gallery mb-4 h-[340px] cursor-pointer rounded-2xl border bg-white max-[540px]:max-h-[220px] lg:h-[325px]"
        navigation={{
          prevEl: ".my-button-prev",
          nextEl: ".my-button-next",
          disabledClass: "!hidden",
        }}
        pagination={{
          type: "custom",
          renderCustom(_, current, total) {
            return `<div class="flex items-center justify-end mr-6"><span class="text-xs rounded-[40px] pointer-events-none py-1 px-2.5 bg-black/40 text-white">${current}/${total}</span></div>`
          },
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Navigation, Pagination, Thumbs]}
      >
        {data.map((image, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex h-full w-full items-center justify-center">
              <img
                src={image.url}
                alt={`Product image ${idx + 1}`}
                className="h-full w-full object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
        <div className="ease-out-quint pointer-events-none absolute inset-y-0 left-0 z-10 mx-4 ml-6 flex -translate-x-2.5 items-center text-white transition-transform duration-300 group-hover/gallery:translate-x-0 active:scale-95">
          <div className="my-button-prev pointer-events-auto top-1/2 inline-flex aspect-square size-10 -translate-y-1/2 cursor-pointer items-center rounded-full border-white/20 bg-black/40 p-2 opacity-0 backdrop-blur-[30px] transition-opacity duration-200 group-hover/gallery:opacity-100 after:hidden">
            <div className="flex size-full flex-col items-center justify-center">
              <ChevronLeft height={24} width={24} className="-translate-x-[1.5px]" />
            </div>
          </div>
        </div>
        <div className="ease-out-quint pointer-events-none absolute inset-y-0 right-0 z-10 mx-4 mr-6 flex translate-x-2.5 items-center text-white transition-transform duration-300 group-hover/gallery:translate-x-0 active:scale-95">
          <div className="my-button-next pointer-events-auto top-1/2 inline-flex aspect-square size-10 -translate-y-1/2 cursor-pointer items-center rounded-full border-white/20 bg-black/40 p-2 opacity-0 backdrop-blur-[30px] transition-opacity duration-200 group-hover/gallery:opacity-100 after:hidden">
            <div className="flex size-full flex-col items-center justify-center">
              <ChevronRight height={24} width={24} className="translate-x-[1.5px]" />
            </div>
          </div>
        </div>
      </Swiper>

      <Swiper
        className="group/gallery"
        navigation={{
          prevEl: ".my-button-prev",
          nextEl: ".my-button-next",
          disabledClass: "button-disabled",
        }}
        slidesPerView="auto"
        onSwiper={setThumbsSwiper}
        spaceBetween={8}
        freeMode={true}
        watchSlidesProgress={true}
        touchEventsTarget="container"
        modules={[Navigation, FreeMode, Thumbs]}
      >
        {data.map((image, idx) => (
          <SwiperSlide
            className="[.swiper-slide-thumb-active]:border-primary !h-16 !w-16 cursor-pointer rounded-md border bg-white opacity-60 [.swiper-slide-thumb-active]:opacity-100"
            key={idx}
          >
            <div className="flex h-full w-full items-center justify-center rounded-md">
              <img
                src={image.url}
                alt={`Product image ${idx + 1}`}
                className="h-full w-full rounded-md object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
        <div className="text-foreground pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center bg-[linear-gradient(270deg,rgba(255,255,255,0)0%,rgba(255,255,255,0.35)25%,rgba(255,255,255,0.65)65%,rgba(255,255,255,1)100%)] px-4 has-[.!hidden]:bg-transparent has-[.button-disabled]:hidden dark:bg-[linear-gradient(270deg,rgba(0,0,0,0)0%,rgba(0,0,0,0.35)25%,rgba(0,0,0,0.65)65%,rgba(0,0,0,1)100%)]">
          <div className="my-button-prev bg-background pointer-events-auto inline-flex size-6 cursor-pointer items-center rounded-full border p-0.5 opacity-0 transition-opacity duration-200 group-hover/gallery:opacity-100 after:hidden [.button-disabled]:hidden">
            <div className="flex size-full flex-col items-center justify-center">
              <ChevronLeft height={24} width={24} className="-translate-x-[1.5px]" />
            </div>
          </div>
        </div>
        <div className="text-foreground pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center bg-[linear-gradient(90deg,rgba(255,255,255,0)0%,rgba(255,255,255,0.35)25%,rgba(255,255,255,0.65)65%,rgba(255,255,255,1)100%)] px-4 has-[.button-disabled]:hidden dark:bg-[linear-gradient(90deg,rgba(0,0,0,0)0%,rgba(0,0,0,0.35)25%,rgba(0,0,0,0.65)65%,rgba(0,0,0,1)100%)]">
          <div className="my-button-next bg-background pointer-events-auto inline-flex size-6 cursor-pointer items-center rounded-full border p-0.5 opacity-0 transition-opacity duration-200 group-hover/gallery:opacity-100 after:hidden">
            <div className="flex size-full flex-col items-center justify-center">
              <ChevronRight height={24} width={24} className="translate-x-[1.5px]" />
            </div>
          </div>
        </div>
      </Swiper>
    </div>
  )
}
