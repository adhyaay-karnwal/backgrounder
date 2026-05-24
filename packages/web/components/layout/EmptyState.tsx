import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Centered empty-state block with optional icon, title, description, and CTA.
 *
 *   <EmptyState
 *     icon={<Inbox className="size-6" />}
 *     title="No chats yet"
 *     description="Start a new conversation to see it here."
 *     action={<Button>New chat</Button>}
 *   />
 */
export interface EmptyStateProps extends Omit<React.ComponentProps<"div">, "title"> {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-10 text-center",
        className
      )}
      {...props}
    >
      {icon ? (
        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <div className="flex flex-col items-center gap-1">
        <div className="text-sm font-medium text-foreground">{title}</div>
        {description ? (
          <div className="max-w-sm text-sm text-muted-foreground">
            {description}
          </div>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
