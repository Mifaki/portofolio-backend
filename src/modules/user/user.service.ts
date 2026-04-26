import { CreateUserDto, UpdateUserDto } from "./user.dto";

import { prisma } from "@/config/prisma";

export async function getAllUsers() {
    return prisma.user.findMany();
}

export async function createUser(dto: CreateUserDto) {
    return prisma.user.create({
        data: dto,
    });
}

export async function getUserById(id: number) {
    return prisma.user.findUnique({
        where: {
            id: id,
        },
    });
}

export async function updateUser(id: number, dto: UpdateUserDto) {
    return prisma.user.update({
        where: {
            id: id,
        },
        data: dto,
    });
}

export async function deleteUser(id: number) {
    return prisma.user.delete({
        where: {
            id: id,
        },
    });
}