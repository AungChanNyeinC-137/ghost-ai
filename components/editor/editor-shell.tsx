"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

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

interface EditorShellProps {
  myProjects: ProjectData[]
  sharedProjects: ProjectData[]
  currentProjectId?: string
}

export function EditorShell({
  myProjects,
  sharedProjects,
  currentProjectId,
}: EditorShellProps) {
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(true)
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
  } = useProjectActions(currentProjectId)

  const router = useRouter()

  const handleProjectSelect = (project: ProjectData) => {
    router.push(`/editor/${project.id}`)
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isProjectSidebarOpen}
        onToggleSidebar={() => setIsProjectSidebarOpen((isOpen) => !isOpen)}
      />

      <main className="relative min-h-0 flex-1 overflow-hidden">
        {isProjectSidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-10 bg-black/40 sm:hidden"
            onClick={() => setIsProjectSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <ProjectSidebar
          isOpen={isProjectSidebarOpen}
          onClose={() => setIsProjectSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          myProjects={myProjects}
          sharedProjects={sharedProjects}
          onCreate={openCreateDialog}
          onSelectProject={handleProjectSelect}
          onRename={openRenameDialog}
          onDelete={openDeleteDialog}
        />

        <section className="flex h-full min-h-[calc(100vh-3.5rem)] items-center justify-center bg-base px-6">
          <div className="max-w-2xl rounded-3xl  p-10 text-center  sm:p-12">
            <h1 className="text-3xl font-semibold tracking-tight text-copy-primary">
              Create a project or open an existing one
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-copy-secondary">
              Start a new architecture workspace, or choose a project from the sidebar.
            </p>
            <div className="mt-8 flex justify-center">
              <Button type="button" size="lg" onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>
        </section>

        <Dialog open={dialogMode === "create"} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
              <DialogDescription>
                Live preview the slug while typing the project name.
              </DialogDescription>
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

        <Dialog open={dialogMode === "rename"} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename project</DialogTitle>
              <DialogDescription>
                Current project name: {activeProject?.name ?? "Unknown project"}.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                submitRename()
              }}
            >
              <div className="space-y-2">
                <label htmlFor="rename-project-name" className="block text-sm font-medium text-copy-primary">
                  Project name
                </label>
                <Input
                  id="rename-project-name"
                  autoFocus
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                />
              </div>
              <div className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-copy-secondary">
                Slug preview: <span className="font-medium text-copy-primary">{slugPreview}</span>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={dialogMode === "delete"} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete project</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Confirm below to permanently delete this project.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-copy-secondary">
                Project to delete: <span className="font-medium text-copy-primary">{activeProject?.name ?? "Unknown project"}</span>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="button" variant="destructive" onClick={submitDelete} disabled={isLoading}>
                  Delete project
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
