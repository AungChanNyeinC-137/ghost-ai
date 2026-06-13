import prisma from "./prisma";

export type ProjectData = {
  id: string;
  name: string;
  slug: string;
  owned: boolean;
};

function slugifyProjectName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "") || "untitled-project";
}

export async function getEditorProjectLists(userId: string, email: string | null = null) {
  const sharedEmail = email;

  const myProjects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  const sharedProjects = sharedEmail
    ? await prisma.project.findMany({
        where: {
          ownerId: { not: userId },
          collaborators: { some: { email: sharedEmail } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return {
    myProjects: myProjects.map((project) => ({
      id: project.id,
      name: project.name,
      slug: slugifyProjectName(project.name),
      owned: true,
    })),
    sharedProjects: sharedProjects.map((project) => ({
      id: project.id,
      name: project.name,
      slug: slugifyProjectName(project.name),
      owned: false,
    })),
  };
}

export async function getProjectById(projectId: string, userId: string, email: string | null = null) {
  const sharedEmail = email;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: userId },
        sharedEmail
          ? {
              collaborators: {
                some: {
                  email: sharedEmail,
                },
              },
            }
          : undefined,
      ].filter(Boolean) as object[],
    },
  });

  if (!project) {
    return null;
  }

  return {
    id: project.id,
    name: project.name,
    slug: slugifyProjectName(project.name),
    owned: project.ownerId === userId,
  };
}
