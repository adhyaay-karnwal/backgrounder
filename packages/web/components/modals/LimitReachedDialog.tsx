"use client"

import { useCallback, useRef, useEffect } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Crown, Key } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ModalHeader, focusChatPrompt } from "@/components/ui/modal-header"
import { AgentIcon } from "@/components/icons/agent-icons"

interface LimitReachedDialogProps {
  open: boolean
  onClose: () => void
  onContinueWithOpenCode: () => void
  onAddApiKey: () => void
  onUpgradeToPro: () => void
  remaining?: number
  resetAt?: Date
  isMobile?: boolean
}

export function LimitReachedDialog({
  open,
  onClose,
  onContinueWithOpenCode,
  onAddApiKey,
  onUpgradeToPro,
  resetAt,
  isMobile = false,
}: LimitReachedDialogProps) {
  const primaryButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        primaryButtonRef.current?.focus()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleContinueWithOpenCode = useCallback(() => {
    onContinueWithOpenCode()
    onClose()
  }, [onContinueWithOpenCode, onClose])

  const handleAddApiKey = useCallback(() => {
    onAddApiKey()
    onClose()
  }, [onAddApiKey, onClose])

  const handleUpgradeToPro = useCallback(() => {
    onUpgradeToPro()
    onClose()
  }, [onUpgradeToPro, onClose])

  const resetTimeString = resetAt
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
      }).format(resetAt)
    : "midnight UTC"

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        />
        <Dialog.Content
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            primaryButtonRef.current?.focus()
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault()
            focusChatPrompt()
          }}
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden bg-background border border-border shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            isMobile
              ? "inset-x-4 top-1/2 -translate-y-1/2 rounded-xl"
              : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-xl"
          )}
        >
          <ModalHeader title="Daily limit reached" />
          <div className="space-y-4 px-4 pt-3 pb-4">
            <p className="text-sm text-muted-foreground">
              You've used your {10} free Claude Code messages for today. Your limit resets at{" "}
              <span className="font-medium text-foreground">{resetTimeString}</span>.
            </p>

            <div className="space-y-2">
              {/* Primary option: Continue with OpenCode */}
              <button
                ref={primaryButtonRef}
                onClick={handleContinueWithOpenCode}
                className="w-full flex items-center gap-3 rounded-lg border border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors p-3 text-left cursor-pointer focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <AgentIcon agent="opencode" className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">
                    Continue with OpenCode
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Free and unlimited — powered by open source models
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">Free</Badge>
              </button>

              {/* Option 2: Add API Key */}
              <button
                onClick={handleAddApiKey}
                className="w-full flex items-center gap-3 rounded-lg border border-border hover:bg-accent/50 transition-colors p-3 text-left cursor-pointer focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Key className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">
                    Add your Claude API key
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Use your own Anthropic API key for unlimited Claude usage
                  </div>
                </div>
              </button>

              {/* Option 3: Upgrade to Pro */}
              <button
                onClick={handleUpgradeToPro}
                className="w-full flex items-center gap-3 rounded-lg border border-warning/40 hover:bg-warning/10 transition-colors p-3 text-left cursor-pointer focus:outline-none focus-visible:ring-[3px] focus-visible:ring-warning/30"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10">
                  <Crown className="size-5 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">
                    Upgrade to Pro
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Unlimited Claude Code messages and priority support
                  </div>
                </div>
                <Badge variant="warning" className="shrink-0">Pro</Badge>
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <Button variant="ghost" size="sm" onClick={onClose} type="button">
                Cancel
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
