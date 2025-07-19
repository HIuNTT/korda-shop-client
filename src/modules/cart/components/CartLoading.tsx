import WaveIcon from "@/components/icons/WaveIcon"
import { Skeleton } from "@/components/ui/skeleton"

export default function CartLoading() {
  return (
    <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
      <div className="flex flex-col gap-2 md:col-span-2">
        <div className="bg-background flex items-center justify-between rounded-lg px-4 py-2.5">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-6 w-6" />
        </div>
        {Array(5)
          .fill("")
          .map((_, idx) => (
            <div
              key={idx}
              className="bg-background flex h-23 items-center justify-between gap-2 rounded-lg px-4 py-2.5"
            >
              <div className="flex flex-1 items-center gap-2">
                <Skeleton className="h-6 w-6" />
                <div className="flex w-full flex-1 gap-2">
                  <Skeleton className="size-17" />
                  <div className="flex flex-1 flex-col justify-center gap-0.5">
                    <Skeleton className="h-5 max-h-5 flex-1" />
                    <Skeleton className="h-5 w-20" />
                    <div className="flex items-center justify-between md:hidden">
                      <Skeleton className="h-5 max-h-5 w-20" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 max-md:hidden">
                    <div className="flex gap-1 md:flex-col md:gap-0.5">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-6 max-h-6 w-25" />
                  </div>
                </div>
                <Skeleton className="h-6 w-6" />
              </div>
            </div>
          ))}
      </div>
      <div className="flex flex-col gap-2 max-md:hidden md:col-span-1">
        <div className="flex flex-col">
          <div className="bg-background flex flex-col gap-2 rounded-t-lg p-4">
            <Skeleton className="h-11" />
            <Skeleton className="h-11" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-2/5" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/4" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/4" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/4" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/4" />
              </div>
            </div>
            <Skeleton className="h-14" />
          </div>
          <WaveIcon fill="currentColor" className="text-background w-full" />
        </div>
      </div>
    </div>
  )
}
