import { auth, currentUser } from "@clerk/nextjs/server"

import { getProjectById } from "@/lib/project-data"

export type ClerkIdentity = {
  userId: string
  email: string | null
}

export async function getClerkIdentity(): Promise<ClerkIdentity | null> {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const user = await currentUser()

  return {
    userId,
    email: user?.emailAddresses?.[0]?.emailAddress ?? null,
  }
}

export async function getProjectWithAccess(
  projectId: string,
  userId: string,
  email: string | null
) {
  return getProjectById(projectId, userId, email)
}
