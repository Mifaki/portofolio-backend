import Joi from "joi";
import { PaginationQuery, paginationSchema } from "@/utils/pagination";

export interface GetRolesQueryDto extends PaginationQuery {
  q?: string;
}

export const getRolesQuerySchema = paginationSchema.keys({
  q: Joi.string().trim().optional(),
});

export interface CreateRoleDto {
  name: string;
  title?: string;
}

export interface UpdateRoleDto {
  name?: string;
  title?: string;
}

export const createRoleSchema = Joi.object<CreateRoleDto>({
  name: Joi.string().max(100).required(),
  title: Joi.string().max(255).optional(),
});

export const updateRoleSchema = Joi.object<UpdateRoleDto>({
  name: Joi.string().max(100).optional(),
  title: Joi.string().max(255).optional(),
}).min(1);

const roleSchema = Joi.object({
  id: Joi.string().uuid(),
  name: Joi.string(),
  title: Joi.string().allow(null),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

export const getAllRolesResponseSchema = Joi.object({
  items: Joi.array().items(roleSchema),
  meta: Joi.object({
    total: Joi.number().integer(),
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
    totalPages: Joi.number().integer(),
  }),
});
export const getRoleByIdResponseSchema = roleSchema;
export const createRoleResponseSchema = roleSchema;
export const updateRoleResponseSchema = roleSchema;
export const deleteRoleResponseSchema = Joi.object({
  id: Joi.string().uuid(),
  name: Joi.string(),
});
