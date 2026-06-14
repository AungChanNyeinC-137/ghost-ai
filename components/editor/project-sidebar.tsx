"use client"

import type { ReactNode } from "react"
import { Edit3, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type Project = {
  id: string
  name: string
  slug: string
  owned: boolean
}

interface ProjectSidebarProps {
  activeProjectId?: string
  isOpen: boolean
  onClose: () => void
  activeTab: "my-projects" | "shared"
  onTabChange: (value: "my-projects" | "shared") => void
  myProjects: Project[]
  sharedProjects: Project[]
  onCreate: () => void
  onSelectProject?: (project: Project) => void
  onRename: (project: Project) => void
  onDelete: (project: Project) => void
}

function EmptyProjectState({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full min-h-48 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-elevated/45 px-6 text-center text-sm text-copy-muted">
      {children}
    </div>
  )
}

export function ProjectSidebar({
  activeProjectId,
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  myProjects,
  sharedProjects,
  onCreate,
  onSelectProject,
  onRename,
  onDelete,
}: ProjectSidebarProps) {
  return (
    <aside
      className={cn(
        "absolute inset-y-0 left-0 z-20 flex w-80 max-w-[calc(100vw-2rem)] flex-col border-r border-surface-border bg-sidebar text-sidebar-foreground shadow-2xl shadow-black/30 transition-transform duration-200 ease-out rounded-3xl md:static md:translate-x-0 md:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full md:hidden"
      )}
      aria-hidden={!isOpen}
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
        <h2 className="text-sm font-semibold text-copy-primary">Projects</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Close project sidebar"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as "my-projects" | "shared")}
        className="min-h-0 flex-1 gap-4 p-4"
      >
        <TabsList className="grid w-full grid-cols-2 bg-subtle">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>

        <TabsContent value="my-projects" className="min-h-0">
          {myProjects.length === 0 ? (
            <EmptyProjectState>No projects yet.</EmptyProjectState>
          ) : (
            <div className="space-y-3">
              {myProjects.map((project) => {
                const isActive = project.id === activeProjectId

                return (
                  <div
                    key={project.id}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "group rounded-2xl border px-4 py-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isActive
                        ? "border-primary/30 bg-primary/5"
                        : "border-surface-border-subtle bg-surface hover:border-primary/20 hover:bg-subtle"
                    )}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => onSelectProject?.(project)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        onSelectProject?.(project)
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-copy-primary">{project.name}</p>
                        <p className="truncate text-xs text-copy-secondary">{project.slug}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 rounded-full"
                          onClick={(event) => {
                            event.stopPropagation()
                            onRename(project)
                          }}
                          aria-label={`Rename ${project.name}`}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 rounded-full text-destructive"
                          onClick={(event) => {
                            event.stopPropagation()
                            onDelete(project)
                          }}
                          aria-label={`Delete ${project.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shared" className="min-h-0">
          {sharedProjects.length === 0 ? (
            <EmptyProjectState>No shared projects yet.</EmptyProjectState>
          ) : (
            <div className="space-y-3">
              {sharedProjects.map((project) => {
                const isActive = project.id === activeProjectId

                return (
                  <div
                    key={project.id}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "rounded-2xl border px-4 py-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isActive
                        ? "border-primary/30 bg-primary/5"
                        : "border-surface-border-subtle bg-surface hover:border-primary/20 hover:bg-subtle"
                    )}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => onSelectProject?.(project)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        onSelectProject?.(project)
                      }
                    }}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-copy-primary">{project.name}</p>
                      <p className="truncate text-xs text-copy-secondary">{project.slug}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="border-t border-sidebar-border p-4">
        <Button type="button" className="w-full" onClick={onCreate}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  )
}
