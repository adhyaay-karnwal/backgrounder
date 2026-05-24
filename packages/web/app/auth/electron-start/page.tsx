"use client"

import { useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

/**
 * Electron OAuth Start Page
 *
 * This page is opened in the system browser by Electron to complete OAuth.
 * After successful authentication, it generates a JWT token and redirects
 * back to Electron via deep link.
 *
 * Flow:
 * 1. If not authenticated: initiates GitHub OAuth
 * 2. If authenticated: fetches JWT from /api/auth/electron-token
 * 3. Redirects to background-agents://auth?token=<JWT>
 */
export default function ElectronStartPage() {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (status === "authenticated" && session?.user?.id) {
      generateTokenAndRedirect()
    } else if (status === "unauthenticated") {
      signIn("github", {
        callbackUrl: "/auth/electron-start",
      })
    }
  }, [status, session])

  async function generateTokenAndRedirect() {
    if (redirecting) return
    setRedirecting(true)

    try {
      const response = await fetch("/api/auth/electron-token", {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate token")
      }

      const { token } = await response.json()

      setRedirected(true)

      window.location.href = `background-agents://auth?token=${encodeURIComponent(token)}`
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      setRedirecting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md text-center">
        <CardContent className="flex flex-col items-center gap-4 py-2">
          {error ? (
            <>
              <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="size-6" />
              </div>
              <div className="space-y-1">
                <h1 className="text-lg font-semibold">Authentication error</h1>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button
                onClick={() => {
                  setError(null)
                  setRedirecting(false)
                  window.location.reload()
                }}
              >
                Try again
              </Button>
            </>
          ) : redirected ? (
            <>
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="size-6" />
              </div>
              <div className="space-y-1">
                <h1 className="text-lg font-semibold">Signed in successfully</h1>
                <p className="text-sm text-muted-foreground">
                  You can close this tab and return to the app.
                </p>
              </div>
            </>
          ) : (
            <>
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {status === "loading"
                  ? "Loading…"
                  : status === "authenticated"
                    ? "Redirecting to app…"
                    : "Signing in with GitHub…"}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
