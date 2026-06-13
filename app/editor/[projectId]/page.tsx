import { auth, currentUser } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"

import { getProjectById } from "@/lib/project-data"

interface EditorWorkspacePageProps {
  params: {
    projectId: string
  }
}

export default async function EditorWorkspacePage({ params }: EditorWorkspacePageProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null
  const project = await getProjectById(params.projectId, userId, email)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-base px-6 py-10 text-copy-primary">
      <div className="mx-auto max-w-4xl rounded-3xl border border-surface-border bg-surface p-10 shadow-lg shadow-black/5">
        <h1 className="text-3xl font-semibold">{project.name}</h1>
        <p className="mt-3 text-sm text-copy-secondary">
          Workspace for <span className="font-medium">{project.slug}</span>. This is the editor workspace shell placeholder.
        </p>
      </div>
    </div>
  )
}
