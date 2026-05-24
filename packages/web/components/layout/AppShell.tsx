import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Root layout shell. Owns the sidebar / main grid and applies safe-area
 * padding. Pages and the chat root should compose `AppShell` directly to
 * avoid re-implementing the wrapper geometry.
 *
 *   <AppShell>
 *     <AppShell.Sidebar><Sidebar /></AppShell.Sidebar>
 *     <AppShell.Main>...</AppShell.Main>
 *   </AppShell>
 */
function AppShellRoot({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-shell"
      className={cn(
        "flex h-screen-mobile w-full overflow-hidden bg-background text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AppShellSidebar({
  className,
  ...props
}: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="app-shell-sidebar"
      className={cn(
        "hidden h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex",
        className
      )}
      {...props}
    />
  )
}

function AppShellMain({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="app-shell-main"
      className={cn("flex h-full min-w-0 flex-1 flex-col overflow-hidden", className)}
      {...props}
    />
  )
}

export const AppShell = Object.assign(AppShellRoot, {
  Sidebar: AppShellSidebar,
  Main: AppShellMain,
})
