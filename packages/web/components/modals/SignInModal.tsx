"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { Github, MessageSquare } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModalHeader, focusChatPrompt } from "@/components/ui/modal-header"
import { signInWithGitHub } from "@/lib/auth-utils"

interface SignInModalProps {
  open: boolean
  onClose: () => void
  isMobile?: boolean
}

export function SignInModal({ open, onClose, isMobile = false }: SignInModalProps) {
  const handleSignIn = () => {
    signInWithGitHub()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          )}
        />
        <Dialog.Content
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
              : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-lg"
          )}
        >
          <ModalHeader
            title={
              <>
                <MessageSquare className="size-4" />
                Sign in to continue
              </>
            }
          />

          <div className="flex flex-col items-center space-y-4 p-6 text-center">
            <p
              className={cn(
                "text-muted-foreground",
                isMobile ? "text-base" : "text-sm"
              )}
            >
              Sign in with GitHub to start chatting with AI agents. Your message
              will be sent automatically after signing in.
            </p>

            <Button
              autoFocus
              onClick={handleSignIn}
              size={isMobile ? "lg" : "default"}
              className="w-full"
            >
              <Github />
              Sign in with GitHub
            </Button>
          </div>

          <div className="flex justify-center border-t border-border bg-background px-4 py-3">
            <Button variant="link" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
