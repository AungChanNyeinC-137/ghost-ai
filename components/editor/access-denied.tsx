import Link from "next/link"
import { Lock } from "lucide-react"

import { Button } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-6 py-10 text-copy-primary">
      <div className="w-full max-w-md rounded-3xl border border-surface-border bg-surface p-10 text-center shadow-lg shadow-black/5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Access denied</h1>
        <p className="mt-3 text-sm leading-6 text-copy-secondary">
          You do not have permission to open this workspace, or the room does not exist.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/editor">Return to projects</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
