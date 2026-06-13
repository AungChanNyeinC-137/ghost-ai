import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
    description?: string | null;
    id?: string;
  };

  const data: {
    ownerId: string;
    name: string;
    description: string | null;
    status: "DRAFT" | "ARCHIVED";
    canvasJsonPath: string | null;
    id?: string;
  } = {
    ownerId: userId,
    name: body.name?.trim() || "Untitled Project",
    description: body.description ?? null,
    status: "DRAFT",
    canvasJsonPath: null,
  };

  if (body.id) {
    data.id = body.id
  }

  const project = await prisma.project.create({
    data,
  });

  return NextResponse.json(project, { status: 201 });
}
