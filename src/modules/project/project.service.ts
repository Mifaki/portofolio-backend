import { CreateProjectDto, GetProjectsQueryDto, UpdateProjectDto, UpdateProjectPositionDto } from "./project.dto";

import { httpError } from "@/utils/error";
import { paginate, toPrismaPage } from "@/utils/pagination";
import { prisma } from "@/config/prisma";

const projectSelect = {
  id: true,
  position: true,
  title: true,
  category: true,
  type: true,
  year: true,
  createdAt: true,
  modifiedAt: true,
  texts: {
    select: { id: true, type: true, position: true, content: true },
    orderBy: { position: "asc" as const },
  },
  images: {
    select: { id: true, type: true, orientation: true, imageUrl: true },
    orderBy: { createdAt: "asc" as const },
  },
};

export async function getAllProjects(query: GetProjectsQueryDto) {
  const { skip, take } = toPrismaPage(query);
  const where = {
    deletedAt: null,
    ...(query.q ? { title: { contains: query.q, mode: "insensitive" as const } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.project.findMany({ where, select: projectSelect, skip, take, orderBy: { position: "asc" } }),
    prisma.project.count({ where }),
  ]);

  return paginate(items, total, query);
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findFirst({
    where: { id, deletedAt: null },
    select: projectSelect,
  });
  if (!project) throw httpError(404, "Project not found");
  return project;
}

export async function createProject(dto: CreateProjectDto) {
  const existing = await prisma.project.findFirst({ where: { title: dto.title } });
  if (existing) throw httpError(409, "A project with this title already exists");

  return prisma.project.create({
    data: {
      position: dto.position,
      title: dto.title,
      category: dto.category,
      type: dto.type,
      year: dto.year,
      texts: dto.texts?.length
        ? { create: dto.texts.map(({ content, position }) => ({ type: "regular" as const, content, position })) }
        : undefined,
      images: dto.images?.length
        ? { create: dto.images.map(({ imageUrl, type, orientation }) => ({ imageUrl, type, orientation })) }
        : undefined,
    },
    select: projectSelect,
  });
}

export async function updateProject(id: string, dto: UpdateProjectDto) {
  await getProjectById(id);

  return prisma.$transaction(async (tx) => {
    if (dto.texts !== undefined) {
      await tx.projectText.deleteMany({ where: { projectId: id } });
    }
    if (dto.images !== undefined) {
      await tx.projectImage.deleteMany({ where: { projectId: id } });
    }

    return tx.project.update({
      where: { id },
      data: {
        ...(dto.position !== undefined && { position: dto.position }),
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.year !== undefined && { year: dto.year }),
        ...(dto.texts !== undefined && {
          texts: { create: dto.texts.map(({ content, position }) => ({ type: "regular" as const, content, position })) },
        }),
        ...(dto.images !== undefined && {
          images: { create: dto.images.map(({ imageUrl, type, orientation }) => ({ imageUrl, type, orientation })) },
        }),
      },
      select: projectSelect,
    });
  });
}

export async function updateProjectPosition(dto: UpdateProjectPositionDto) {
  const project = await prisma.project.findFirst({
    where: { id: dto.projectId, deletedAt: null },
    select: { id: true, position: true },
  });

  if (!project) throw httpError(404, "Project not found");
  if (project.position !== dto.originalPosition) {
    throw httpError(409, "Original position does not match the project's current position");
  }
  
  if (dto.originalPosition === dto.newPosition) {
    return prisma.project.findFirst({ where: { id: dto.projectId }, select: projectSelect });
  }

  return prisma.$transaction(async (tx) => {
    if (dto.newPosition > dto.originalPosition) {
      await tx.project.updateMany({
        where: {
          deletedAt: null,
          position: { gt: dto.originalPosition, lte: dto.newPosition },
          NOT: { id: dto.projectId },
        },
        data: { position: { decrement: 1 } },
      });
    } else {
      await tx.project.updateMany({
        where: {
          deletedAt: null,
          position: { gte: dto.newPosition, lt: dto.originalPosition },
          NOT: { id: dto.projectId },
        },
        data: { position: { increment: 1 } },
      });
    }

    return tx.project.update({
      where: { id: dto.projectId },
      data: { position: dto.newPosition },
      select: projectSelect,
    });
  });
}

export async function deleteProject(id: string) {
  await getProjectById(id);
  return prisma.project.update({
    where: { id },
    data: { deletedAt: new Date() },
    select: { id: true, title: true },
  });
}
