import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Page header with title, optional description, and a slot for actions.
 *
 *   <PageHeader
 *     title="Jobs"
 *     description="Scheduled background work for this workspace."
 *     actions={<Button>New job</Button>}
 *   />
 */
export interface PageHeaderProps extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "flex flex-col gap-1 border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="min-w-0">
        <h1 className="text-lg font-semibold leading-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}
