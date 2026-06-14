"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { useProjectActions, ProjectData } from "@/hooks/use-project-actions"

interface WorkspaceShellProps {
  project: ProjectData
  myProjects: ProjectData[]
  sharedProjects: ProjectData[]
  currentRoomId: string
}

export function WorkspaceShell({
  project,
  myProjects,
  sharedProjects,
  currentRoomId,
}: WorkspaceShellProps) {
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(true)
  const [isAIVisible, setIsAIVisible] = useState(true)
  const {
    activeTab,
    dialogMode,
    activeProject,
    projectName,
    slugPreview,
    isLoading,
    setActiveTab,
    setProjectName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  } = useProjectActions(currentRoomId)

  const router = useRouter()
  const projectDescription = project.owned ? "Owned by you" : "Shared workspace"

  const handleSelectProject = (project: ProjectData) => {
    router.push(`/editor/${project.id}`)
  }

  const handleShare = async () => {
    if (typeof window === "undefined" || !navigator.clipboard) {
      return
    }

    await navigator.clipboard.writeText(window.location.href)
  }

  return (
    <div className="min-h-screen bg-base text-copy-primary">
      <div className="flex min-h-screen flex-col">
        <EditorNavbar
          title={project.name}
          isSidebarOpen={isProjectSidebarOpen}
          isAIVisible={isAIVisible}
          onToggleSidebar={() => setIsProjectSidebarOpen((open) => !open)}
          onToggleAI={() => setIsAIVisible((visible) => !visible)}
          onShare={handleShare}
        />

        <div className="relative flex flex-1 overflow-hidden">
          <ProjectSidebar
            activeProjectId={currentRoomId}
            isOpen={isProjectSidebarOpen}
            onClose={() => setIsProjectSidebarOpen(false)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            myProjects={myProjects}
            sharedProjects={sharedProjects}
            onCreate={openCreateDialog}
            onSelectProject={handleSelectProject}
            onRename={openRenameDialog}
            onDelete={openDeleteDialog}
          />

          {isProjectSidebarOpen && (
            <button
              type="button"
              className="fixed inset-0 z-10 bg-black/40 md:hidden"
              onClick={() => setIsProjectSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          <main className="relative flex flex-1 flex-col overflow-hidden bg-base px-4 py-6 md:px-6">
            <div className="flex h-full min-h-0 gap-6">
              <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-surface-border bg-surface">
                <div className="border-b border-surface-border px-6 py-5">
                  <div className="text-xs uppercase tracking-[0.3em] text-copy-secondary">Room</div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-copy-primary">{project.name}</h2>
                    <span className="rounded-full border border-surface-border px-3 py-1 text-xs uppercase tracking-[0.25em] text-copy-secondary">
                      {projectDescription}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-center overflow-auto px-6 py-10">
                  <div className="w-full max-w-4xl rounded-[2rem] border border-surface-border-subtle bg-base/80 p-12 text-center shadow-inner shadow-black/10">
                    <p className="text-sm uppercase tracking-[0.3em] text-copy-secondary">Workspace canvas</p>
                    <h1 className="mt-6 text-4xl font-semibold tracking-tight text-copy-primary">
                      {project.name} room placeholder
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-copy-secondary">
                      This is the editor workspace shell placeholder. The actual design canvas and AI chat experience will be built here next.
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border border-surface-border bg-surface p-5 text-left">
                        <p className="text-sm font-medium text-copy-primary">Room ID</p>
                        <p className="mt-2 text-sm text-copy-secondary">{currentRoomId}</p>
                      </div>
                      <div className="rounded-3xl border border-surface-border bg-surface p-5 text-left">
                        <p className="text-sm font-medium text-copy-primary">Project slug</p>
                        <p className="mt-2 text-sm text-copy-secondary">{project.slug}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {isAIVisible ? (
                <aside className="hidden w-80 shrink-0 flex-col rounded-3xl border border-surface-border bg-surface p-6 xl:flex">
                  <div className="text-sm font-semibold text-copy-primary">AI Copilot</div>
                  <p className="mt-3 text-sm leading-6 text-copy-secondary">Placeholder panel</p>
                  <div className="mt-6 rounded-3xl border border-surface-border-subtle bg-base/80 p-4 text-sm text-copy-secondary">
                    Chat surface pending. The toggle is wired. Messaging and generation are intentionally out of scope here.
                  </div>
                  <div className="mt-auto rounded-3xl border border-surface-border-subtle bg-surface p-4 text-sm text-copy-secondary">
                    Future hooks: Prompt composer, run status, and architecture guidance will attach to this sidebar.
                  </div>
                </aside>
              ) : null}
            </div>
          </main>

          <Dialog open={dialogMode === "create"} onOpenChange={(open) => !open && closeDialog()}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create project</DialogTitle>
                <DialogDescription>Live preview the slug while typing the project name.</DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  submitCreate()
                }}
              >
                <div className="space-y-2">
                  <label htmlFor="project-name" className="block text-sm font-medium text-copy-primary">
                    Project name
                  </label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                    placeholder="Enter a project name"
                  />
                </div>
                <div className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-copy-secondary">
                  Slug preview: <span className="font-medium text-copy-primary">{slugPreview}</span>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    Create project
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
