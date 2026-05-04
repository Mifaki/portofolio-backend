import { CreateRoleDto, GetRolesQueryDto, UpdateRoleDto } from "./role.dto";

import { httpError } from "@/utils/error";
import { paginate, toPrismaPage } from "@/utils/pagination";
import { prisma } from "@/config/prisma";

const roleSelect = {
  id: true,
  name: true,
  title: true,
  createdAt: true,
  updatedAt: true,
};

export async function getAllRoles(query: GetRolesQueryDto) {
  const { skip, take } = toPrismaPage(query);
  const where = {
    deletedAt: null,
    ...(query.q
      ? {
          OR: [
            { name: { contains: query.q, mode: "insensitive" as const } },
            { title: { contains: query.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.role.findMany({ where, select: roleSelect, skip, take, orderBy: { name: "asc" } }),
    prisma.role.count({ where }),
  ]);

  return paginate(items, total, query);
}

export async function getRoleById(id: string) {
  const role = await prisma.role.findFirst({
    where: { id, deletedAt: null },
    select: roleSelect,
  });
  if (!role) throw httpError(404, "Role not found");
  return role;
}

export async function createRole(dto: CreateRoleDto) {
  const existing = await prisma.role.findFirst({ where: { name: dto.name } });
  if (existing) throw httpError(409, "A role with this name already exists");

  return prisma.role.create({
    data: { name: dto.name, title: dto.title },
    select: roleSelect,
  });
}

export async function updateRole(id: string, dto: UpdateRoleDto) {
  await getRoleById(id);

  if (dto.name) {
    const conflict = await prisma.role.findFirst({
      where: { name: dto.name, NOT: { id } },
    });
    if (conflict) throw httpError(409, "A role with this name already exists");
  }

  return prisma.role.update({
    where: { id },
    data: dto,
    select: roleSelect,
  });
}

export async function deleteRole(id: string) {
  await getRoleById(id);
  return prisma.role.update({
    where: { id },
    data: { deletedAt: new Date() },
    select: { id: true, name: true },
  });
}
