import { redirect } from "next/navigation"

import { getClerkIdentity, getProjectWithAccess } from "@/lib/project-access"
import { getEditorProjectLists } from "@/lib/project-data"
import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceShell } from "@/components/editor/workspace-shell"

interface EditorWorkspacePageProps {
  params: {
    projectId: string
  }
}

export default async function EditorWorkspacePage({ params }: EditorWorkspacePageProps) {
  const identity = await getClerkIdentity()

  if (!identity) {
    redirect("/sign-in")
  }

  const project = await getProjectWithAccess(params.projectId, identity.userId, identity.email)

  if (!project) {
    return <AccessDenied />
  }

  const { myProjects, sharedProjects } = await getEditorProjectLists(identity.userId, identity.email)

  return (
    <WorkspaceShell
      project={project}
      myProjects={myProjects}
      sharedProjects={sharedProjects}
      currentRoomId={params.projectId}
    />
  )
}
