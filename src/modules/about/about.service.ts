import { CreateAboutDto, UpdateAboutDto } from "./about.dto";

import { httpError } from '../../utils/error';
import { prisma } from '../../config/prisma';

const aboutSelect = {
  id: true,
  name: true,
  instagram: true,
  github: true,
  linkedin: true,
  createdAt: true,
  modifiedAt: true,
  descriptions: {
    select: { id: true, content: true, position: true },
    orderBy: { position: "asc" as const },
  },
  techStacks: {
    select: {
      id: true,
      name: true,
      category: { select: { id: true, name: true } },
      percentage: true,
      position: true,
    },
    orderBy: { position: "asc" as const },
  },
  images: {
    select: { id: true, imageUrl: true, position: true },
    orderBy: { position: "asc" as const },
  },
  workExperiences: {
    select: {
      id: true,
      company: true,
      role: true,
      description: true,
      location: true,
      startMonth: true,
      startYear: true,
      endMonth: true,
      endYear: true,
      position: true,
    },
    orderBy: { position: "asc" as const },
  },
};

async function resolveCategoryIds(
  techStacks: { name: string; category: string; percentage: number; position: number }[],
): Promise<{ name: string; categoryId: string; percentage: number; position: number }[]> {
  const uniqueNames = [...new Set(techStacks.map((t) => t.category))];

  const resolved = await Promise.all(
    uniqueNames.map((name) =>
      (prisma as any).techStackCategory.upsert({
        where: { name },
        update: {},
        create: { name },
        select: { id: true, name: true },
      }),
    ),
  );

  const categoryMap = new Map((resolved as { id: string; name: string }[]).map((c) => [c.name, c.id]));

  return techStacks.map(({ name, category, percentage, position }) => ({
    name,
    categoryId: categoryMap.get(category)!,
    percentage,
    position,
  }));
}

export async function getTechStackCategories() {
  return (prisma as any).techStackCategory.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  }) as Promise<{ id: string; name: string }[]>;
}

async function findAbout() {
  return prisma.about.findFirst({ where: { deletedAt: null }, select: aboutSelect });
}

export async function getAbout() {
  const about = await findAbout();
  if (!about) throw httpError(404, "About not found");
  return about;
}

export async function createAbout(dto: CreateAboutDto) {
  const existing = await findAbout();
  if (existing) throw httpError(409, "About already exists");

  const resolvedTechStacks = dto.techStacks?.length
    ? await resolveCategoryIds(dto.techStacks)
    : undefined;

  return prisma.about.create({
    data: {
      name: dto.name,
      instagram: dto.instagram,
      github: dto.github,
      linkedin: dto.linkedin,
      descriptions: dto.descriptions?.length
        ? { create: dto.descriptions.map(({ content, position }) => ({ content, position })) }
        : undefined,
      techStacks: resolvedTechStacks?.length
        ? { create: resolvedTechStacks as any }
        : undefined,
      images: dto.images?.length
        ? { create: dto.images.map(({ imageUrl, position }) => ({ imageUrl, position })) }
        : undefined,
      workExperiences: dto.workExperiences?.length
        ? {
            create: dto.workExperiences.map(({ company, role, description, location, startMonth, startYear, endMonth, endYear, position }) => ({
              company, role, description, location, startMonth, startYear, endMonth, endYear, position,
            })),
          }
        : undefined,
    },
    select: aboutSelect,
  });
}

export async function updateAbout(dto: UpdateAboutDto) {
  const about = await findAbout();
  if (!about) throw httpError(404, "About not found");

  const resolvedTechStacks = dto.techStacks !== undefined
    ? await resolveCategoryIds(dto.techStacks)
    : undefined;

  return prisma.$transaction(async (tx) => {
    if (dto.descriptions !== undefined) {
      await tx.aboutDescription.deleteMany({ where: { aboutId: about.id } });
    }
    if (dto.techStacks !== undefined) {
      await tx.aboutTechStack.deleteMany({ where: { aboutId: about.id } });
    }
    if (dto.images !== undefined) {
      await tx.aboutImage.deleteMany({ where: { aboutId: about.id } });
    }
    if (dto.workExperiences !== undefined) {
      await tx.workExperience.deleteMany({ where: { aboutId: about.id } });
    }

    return tx.about.update({
      where: { id: about.id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.instagram !== undefined && { instagram: dto.instagram }),
        ...(dto.github !== undefined && { github: dto.github }),
        ...(dto.linkedin !== undefined && { linkedin: dto.linkedin }),
        ...(dto.descriptions !== undefined && {
          descriptions: { create: dto.descriptions.map(({ content, position }) => ({ content, position })) },
        }),
        ...(resolvedTechStacks !== undefined && {
          techStacks: { create: resolvedTechStacks as any },
        }),
        ...(dto.images !== undefined && {
          images: { create: dto.images.map(({ imageUrl, position }) => ({ imageUrl, position })) },
        }),
        ...(dto.workExperiences !== undefined && {
          workExperiences: {
            create: dto.workExperiences.map(({ company, role, description, location, startMonth, startYear, endMonth, endYear, position }) => ({
              company,
              role,
              description,
              location,
              startMonth,
              startYear,
              endMonth,
              endYear,
              position,
            })),
          },
        }),
      },
      select: aboutSelect,
    });
  });
}

export async function deleteAbout() {
  const about = await findAbout();
  if (!about) throw httpError(404, "About not found");
  return prisma.about.update({
    where: { id: about.id },
    data: { deletedAt: new Date() },
    select: { id: true, name: true },
  });
}
