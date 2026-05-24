"use client"

/**
 * Composable helpers for git-style modal dialogs. Re-exports from `./dialog`
 * are NOT pulled in here — these are plain blocks used inside dialog content
 * areas (labels, readonly fields, footer with cancel + primary action).
 *
 * Use the canonical `Button` primitive from `./button` instead of the legacy
 * inline action button.
 */

import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/** Responsive label for form fields */
export function DialogLabel({
  children,
  isMobile = false,
}: {
  children: React.ReactNode
  isMobile?: boolean
}) {
  return (
    <label
      className={cn(
        "block text-muted-foreground mb-1",
        isMobile ? "text-sm" : "text-xs"
      )}
    >
      {children}
    </label>
  )
}

/** Readonly display field for showing current values */
export function DialogReadonlyField({
  children,
  isMobile = false,
}: {
  children: React.ReactNode
  isMobile?: boolean
}) {
  return (
    <div
      className={cn(
        "bg-muted/50 rounded-md px-3 font-medium truncate border border-border",
        isMobile ? "py-3 text-base" : "py-2 text-sm"
      )}
    >
      {children}
    </div>
  )
}

/** Standard cancel button for dialogs */
export function DialogCancelButton({
  onClick,
  isMobile = false,
}: {
  onClick: () => void
  isMobile?: boolean
}) {
  return (
    <Button
      variant="ghost"
      size={isMobile ? "default" : "sm"}
      onClick={onClick}
      type="button"
    >
      Cancel
    </Button>
  )
}

/** Standard primary action button for dialogs */
export interface DialogActionButtonProps {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  isMobile?: boolean
  variant?: "primary" | "destructive"
  children: React.ReactNode
  buttonRef?: React.RefObject<HTMLButtonElement | null>
}

export function DialogActionButton({
  onClick,
  disabled = false,
  loading = false,
  isMobile = false,
  variant = "primary",
  children,
  buttonRef,
}: DialogActionButtonProps) {
  return (
    <Button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled || loading}
      variant={variant === "destructive" ? "destructive" : "default"}
      size={isMobile ? "default" : "sm"}
      type="button"
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </Button>
  )
}

/** Standard footer with cancel and action buttons */
export interface DialogFooterProps {
  onCancel: () => void
  onAction: () => void
  actionLabel: string
  disabled?: boolean
  loading?: boolean
  isMobile?: boolean
  variant?: "primary" | "destructive"
  actionButtonRef?: React.RefObject<HTMLButtonElement | null>
}

export function DialogFooter({
  onCancel,
  onAction,
  actionLabel,
  disabled = false,
  loading = false,
  isMobile = false,
  variant = "primary",
  actionButtonRef,
}: DialogFooterProps) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <DialogCancelButton onClick={onCancel} isMobile={isMobile} />
      <DialogActionButton
        onClick={onAction}
        disabled={disabled}
        loading={loading}
        isMobile={isMobile}
        variant={variant}
        buttonRef={actionButtonRef}
      >
        {actionLabel}
      </DialogActionButton>
    </div>
  )
}

/** Responsive icon sizing for dialog headers */
export function dialogIconClass(isMobile: boolean): string {
  return isMobile ? "h-5 w-5" : "h-4 w-4"
}
