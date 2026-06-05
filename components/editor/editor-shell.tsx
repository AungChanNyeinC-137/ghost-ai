"use client"

import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"

export function EditorShell() {
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isProjectSidebarOpen}
        onToggleSidebar={() => setIsProjectSidebarOpen((isOpen) => !isOpen)}
      />

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <ProjectSidebar
          isOpen={isProjectSidebarOpen}
          onClose={() => setIsProjectSidebarOpen(false)}
        />

        <section className="flex h-full min-h-[calc(100vh-3.5rem)] items-center justify-center bg-base">
          <div className="rounded-2xl border border-surface-border bg-surface px-6 py-4 text-sm text-copy-muted">
            Architecture canvas
          </div>
        </section>
      </main>
    </div>
  )
}
