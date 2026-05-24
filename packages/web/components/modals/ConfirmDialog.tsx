"use client"

import { useCallback, useRef, useEffect } from "react"
import * as Dialog from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModalHeader, focusChatPrompt } from "@/components/ui/modal-header"

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "destructive"
  isMobile?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isMobile = false,
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  const handleConfirm = useCallback(() => {
    onConfirm()
    onClose()
  }, [onConfirm, onClose])

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        confirmButtonRef.current?.focus()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          )}
        />
        <Dialog.Content
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            confirmButtonRef.current?.focus()
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
              : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-xl"
          )}
        >
          <ModalHeader title={title} />
          <div className="space-y-4 px-4 pt-3 pb-4 text-sm">
            {description ? (
              <div className="text-muted-foreground">{description}</div>
            ) : null}
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                type="button"
              >
                {cancelLabel}
              </Button>
              <Button
                ref={confirmButtonRef}
                variant={variant === "destructive" ? "destructive" : "default"}
                size="sm"
                onClick={handleConfirm}
                type="button"
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
