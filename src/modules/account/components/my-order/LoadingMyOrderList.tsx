import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingMyOrderList() {
  return Array(5)
    .fill("")
    .map((_, index) => (
      <div key={index} className="bg-background rounded-md px-4 py-3">
        <div className="flex items-center justify-between gap-2 border-b pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-10 rounded md:w-40" />
            <Skeleton className="h-5 w-10 rounded md:w-40" />
          </div>
          <Skeleton className="h-5 w-40 rounded" />
        </div>
        <div className="border-b">
          <div className="flex items-center gap-3 py-3">
            <Skeleton className="size-14 rounded md:size-16" />
            <div className="flex grow flex-col gap-1">
              <Skeleton className="h-4 w-40 rounded md:w-64" />
              <Skeleton className="h-4 w-10 rounded md:w-24" />
              <Skeleton className="h-4 w-8 rounded" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          </div>
        </div>
        <div className="flex justify-end py-3">
          <Skeleton className="h-4 w-48 rounded" />
        </div>
        <div className="flex items-center justify-between gap-2 border-t pt-3 [border-image:repeating-linear-gradient(90deg,var(--border)_0px,var(--border)_10px,transparent_10px,transparent_15px)_1]">
          <Skeleton className="h-4 w-25 rounded md:w-64" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
      </div>
    ))
}
