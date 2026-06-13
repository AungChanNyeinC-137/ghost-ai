"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

export type ProjectData = {
  id: string
  name: string
  slug: string
  owned: boolean
}

type DialogMode = "create" | "rename" | "delete" | null

function slugifyProjectName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "") || "untitled-project"
}

function generateShortSuffix() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 6).toLowerCase()
  }

  return Math.random().toString(36).slice(2, 8)
}

export function useProjectActions(currentProjectId?: string) {
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null)
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"my-projects" | "shared">("my-projects")

  const router = useRouter()
  const [createSuffix, setCreateSuffix] = useState("")

  const slugPreview = useMemo(() => {
    const slug = slugifyProjectName(projectName)

    if (dialogMode === "create") {
      return `${slug}-${createSuffix}`
    }

    return slug
  }, [projectName, createSuffix, dialogMode])

  const closeDialog = () => {
    setDialogMode(null)
    setActiveProject(null)
    setProjectName("")
    setIsLoading(false)
  }

  const openCreateDialog = () => {
    setDialogMode("create")
    setActiveProject(null)
    setProjectName("")
    setCreateSuffix(generateShortSuffix())
  }

  const openRenameDialog = (project: ProjectData) => {
    setDialogMode("rename")
    setActiveProject(project)
    setProjectName(project.name)
  }

  const openDeleteDialog = (project: ProjectData) => {
    setDialogMode("delete")
    setActiveProject(project)
    setProjectName(project.name)
  }

  const submitCreate = async () => {
    if (!projectName.trim()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slugPreview, name: projectName.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to create project")
      }

        const project = await response.json()
      await router.push(`/editor/${project.id}`)
      closeDialog()
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  const submitRename = async () => {
    if (!activeProject || !projectName.trim()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/projects/${activeProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to rename project")
      }

      await router.refresh()
      closeDialog()
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  const submitDelete = async () => {
    if (!activeProject) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/projects/${activeProject.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      const currentWorkspaceDeleted = currentProjectId === activeProject.id
      if (currentWorkspaceDeleted) {
        await router.push("/editor")
      } else {
        await router.refresh()
      }
      closeDialog()
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return {
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
  }
}
