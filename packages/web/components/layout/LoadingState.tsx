import * as React from "react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Three composable loading patterns used across the app.
 */

export function LoadingList({
  rows = 6,
  className,
}: {
  rows?: number
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-2 p-3", className)}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function LoadingMessages({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-6 p-6", className)}>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-16 w-full max-w-[80%]" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-12 w-full max-w-[70%]" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-24 w-full max-w-[85%]" />
      </div>
    </div>
  )
}

export function LoadingTable({
  rows = 5,
  cols = 4,
  className,
}: {
  rows?: number
  cols?: number
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: cols }, (_, c) => (
            <Skeleton key={c} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  )
}
