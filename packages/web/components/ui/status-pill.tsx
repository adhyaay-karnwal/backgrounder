import * as React from "react"
import {
  Calendar,
  Check,
  CircleDashed,
  Clock,
  File as FileIcon,
  type LucideIcon,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Terragon-style thread/chat status indicator. Renders a tiny (12px) icon
 * with a state-specific color. Hover for a textual label.
 *
 *   <StatusIndicator status="running" />
 *
 * Status values are intentionally generic so the same primitive maps onto
 * ChatStatus, ScheduledJob.status, agent run status, etc. The caller picks
 * the closest one.
 */
export type Status =
  | "draft"
  | "scheduled"
  | "pending"
  | "active"
  | "finishing"
  | "complete"
  | "error"
  | "unread"

const ICON_MAP: Record<Exclude<Status, "unread">, LucideIcon> = {
  draft: FileIcon,
  scheduled: Calendar,
  pending: Clock,
  active: CircleDashed,
  finishing: Check,
  complete: Check,
  error: X,
}

const COLOR_MAP: Record<Status, string> = {
  draft: "text-muted-foreground",
  scheduled: "text-muted-foreground",
  pending: "text-warning",
  active: "text-muted-foreground",
  finishing: "text-success",
  complete: "text-success",
  error: "text-destructive",
  unread: "text-info",
}

const LABEL_MAP: Record<Status, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  pending: "Queued",
  active: "Running",
  finishing: "Finishing",
  complete: "Complete",
  error: "Error",
  unread: "Unread",
}

export interface StatusIndicatorProps {
  status: Status
  className?: string
  title?: string
}

export function StatusIndicator({
  status,
  className,
  title,
}: StatusIndicatorProps) {
  if (status === "unread") {
    return (
      <span
        aria-label={title ?? LABEL_MAP.unread}
        title={title ?? LABEL_MAP.unread}
        className={cn(
          "inline-block size-1.5 shrink-0 rounded-full bg-info",
          className
        )}
      />
    )
  }

  const Icon = ICON_MAP[status]
  return (
    <span
      aria-label={title ?? LABEL_MAP[status]}
      title={title ?? LABEL_MAP[status]}
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
    >
      <Icon
        strokeWidth={status === "active" ? 2 : 3}
        className={cn(
          "size-3",
          COLOR_MAP[status],
          status === "active" && "animate-[spin_1.5s_linear_infinite]"
        )}
      />
    </span>
  )
}

/**
 * Larger labeled pill, suitable for the chat header / status banners.
 *
 *   <StatusPill status="running">Running</StatusPill>
 */
export interface StatusPillProps {
  status: Status
  className?: string
  children?: React.ReactNode
}

export function StatusPill({ status, className, children }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground",
        className
      )}
    >
      <StatusIndicator status={status} />
      <span>{children ?? LABEL_MAP[status]}</span>
    </span>
  )
}

/**
 * Map our ChatStatus (+ derived signals) to the generic Status used here.
 */
export function chatStatusToStatus({
  status,
  isUnseen,
  isDraft,
  queuedCount,
}: {
  status: "pending" | "creating" | "ready" | "running" | "error"
  isUnseen?: boolean
  isDraft?: boolean
  queuedCount?: number
}): Status {
  if (status === "error") return "error"
  if (status === "creating" || status === "running") return "active"
  if (isDraft) return "draft"
  if ((queuedCount ?? 0) > 0) return "pending"
  if (isUnseen) return "unread"
  return "complete"
}
