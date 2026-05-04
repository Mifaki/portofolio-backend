import { CreateUserDto, GetUsersQueryDto, UpdateUserDto } from "./user.dto";

import { hashPassword } from "@/middleware/auth";
import { httpError } from "@/utils/error";
import { paginate, toPrismaPage } from "@/utils/pagination";
import { prisma } from "@/config/prisma";

const userSelect = {
  id: true,
  email: true,
  username: true,
  role: { select: { id: true, name: true } },
  lastLoginAt: true,
  createdAt: true,
};

export async function getAllUsers(query: GetUsersQueryDto) {
  const { skip, take } = toPrismaPage(query);
  const where = {
    deletedAt: null,
    ...(query.q
      ? {
          OR: [
            { email: { contains: query.q, mode: "insensitive" as const } },
            { username: { contains: query.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(query.roleId ? { roleId: query.roleId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, select: userSelect, skip, take, orderBy: { createdAt: "desc" } }),
    prisma.user.count({ where }),
  ]);

  return paginate(items, total, query);
}

export async function getUserById(id: string) {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: userSelect,
  });
  if (!user) throw httpError(404, "User not found");
  return user;
}

export async function createUser(dto: CreateUserDto) {
  const existing = await prisma.user.findFirst({
    where: { email: dto.email },
  });
  if (existing) throw httpError(409, "Email already in use");

  const hashed = await hashPassword(dto.password);
  return prisma.user.create({
    data: {
      email: dto.email,
      username: dto.username,
      password: hashed,
      roleId: dto.roleId,
    },
    select: userSelect,
  });
}

export async function updateUser(id: string, dto: UpdateUserDto) {
  await getUserById(id);

  const data: UpdateUserDto & { password?: string } = { ...dto };
  if (dto.password) {
    data.password = await hashPassword(dto.password);
  }

  return prisma.user.update({
    where: { id },
    data,
    select: userSelect,
  });
}

export async function deleteUser(id: string) {
  await getUserById(id);

  return prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
    select: { id: true, email: true, username: true },
  });
}
