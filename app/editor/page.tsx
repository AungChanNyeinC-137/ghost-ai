import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { EditorShell } from "@/components/editor/editor-shell"
import { getEditorProjectLists } from "@/lib/project-data"

export default async function EditorPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null
  const { myProjects, sharedProjects } = await getEditorProjectLists(userId, email)

  return <EditorShell myProjects={myProjects} sharedProjects={sharedProjects} />
}
