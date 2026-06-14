"use client"

import { MessageCircle, PanelLeftClose, PanelLeftOpen, Share2 } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"

interface EditorNavbarProps {
  title?: string
  isSidebarOpen: boolean
  isAIVisible?: boolean
  onToggleSidebar: () => void
  onToggleAI?: () => void
  onShare?: () => void
}

export function EditorNavbar({
  title = "Ghost AI",
  isSidebarOpen,
  isAIVisible = false,
  onToggleSidebar,
  onToggleAI,
  onShare,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen

  return (
    <header className="flex h-14 items-center justify-between border-b border-surface-border bg-surface px-4">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isSidebarOpen ? "Close project sidebar" : "Open project sidebar"}
          aria-pressed={isSidebarOpen}
          onClick={onToggleSidebar}
        >
          <SidebarIcon className="h-5 w-5" />
        </Button>
        <p className="text-sm font-semibold text-copy-primary truncate">{title}</p>
      </div>

      <div className="flex items-center gap-2">
        {onShare ? (
          <Button type="button" variant="ghost" size="icon" onClick={onShare} aria-label="Share workspace link">
            <Share2 className="h-5 w-5" />
          </Button>
        ) : null}
        {onToggleAI ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isAIVisible ? "Hide AI sidebar" : "Show AI sidebar"}
            aria-pressed={isAIVisible}
            onClick={onToggleAI}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        ) : null}
        <UserButton />
      </div>
    </header>
  )
}
