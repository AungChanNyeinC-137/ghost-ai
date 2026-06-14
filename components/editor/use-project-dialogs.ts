"use client"

import { useMemo, useState } from "react"

type Project = {
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

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `project-${Date.now()}`
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Product launch",
      slug: "product-launch",
      owned: true,
    },
    {
      id: "2",
      name: "Platform architecture",
      slug: "platform-architecture",
      owned: true,
    },
    {
      id: "3",
      name: "Team roadmap",
      slug: "team-roadmap",
      owned: false,
    },
  ])
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"my-projects" | "shared">("my-projects")

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [projects, activeProjectId]
  )

  const myProjects = useMemo(
    () => projects.filter((project) => project.owned),
    [projects]
  )

  const sharedProjects = useMemo(
    () => projects.filter((project) => !project.owned),
    [projects]
  )

  const slugPreview = useMemo(() => slugifyProjectName(projectName), [projectName])

  const closeDialog = () => {
    setDialogMode(null)
    setActiveProjectId(null)
    setProjectName("")
    setIsLoading(false)
  }

  const openCreateDialog = () => {
    setDialogMode("create")
    setProjectName("")
    setActiveProjectId(null)
  }

  const openRenameDialog = (project: Project) => {
    setDialogMode("rename")
    setActiveProjectId(project.id)
    setProjectName(project.name)
  }

  const openDeleteDialog = (project: Project) => {
    setDialogMode("delete")
    setActiveProjectId(project.id)
    setProjectName(project.name)
  }

  const submitCreate = () => {
    if (!projectName.trim()) {
      return
    }

    setIsLoading(true)

    window.setTimeout(() => {
      setProjects((current) => [
        {
          id: generateId(),
          name: projectName.trim(),
          slug: slugPreview,
          owned: true,
        },
        ...current,
      ])
      closeDialog()
    }, 150)
  }

  const submitRename = () => {
    if (!activeProject || !projectName.trim()) {
      return
    }

    setIsLoading(true)

    window.setTimeout(() => {
      setProjects((current) =>
        current.map((project) =>
          project.id === activeProject.id
            ? { ...project, name: projectName.trim(), slug: slugPreview }
            : project
        )
      )
      closeDialog()
    }, 150)
  }

  const submitDelete = () => {
    if (!activeProject) {
      return
    }

    setIsLoading(true)

    window.setTimeout(() => {
      setProjects((current) => current.filter((project) => project.id !== activeProject.id))
      closeDialog()
    }, 150)
  }

  return {
    activeTab,
    myProjects,
    sharedProjects,
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
