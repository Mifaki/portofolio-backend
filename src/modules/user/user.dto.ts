import Joi, { ObjectSchema } from "joi";
import { PaginationQuery, paginationSchema } from "@/utils/pagination";

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  roleId?: string;
}

export const createUserSchema: ObjectSchema<CreateUserDto> =
  Joi.object<CreateUserDto>({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format.",
      "any.required": "Email is required.",
    }),
    username: Joi.string().max(255).required().messages({
      "string.empty": "Username cannot be empty.",
      "any.required": "Username is required.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters.",
      "string.empty": "Password cannot be empty.",
      "any.required": "Password is required.",
    }),
    roleId: Joi.string().optional(),
  });

export interface GetUsersQueryDto extends PaginationQuery {
  q?: string;
}

export const getUsersQuerySchema = paginationSchema.keys({
  q: Joi.string().trim().optional(),
});

export interface UpdateUserDto {
  email?: string;
  username?: string;
  password?: string;
  roleId?: string;
  
}

export const updateUserSchema: ObjectSchema<UpdateUserDto> =
  Joi.object<UpdateUserDto>({
    email: Joi.string().email().optional().messages({
      "string.email": "Invalid email format.",
    }),
    username: Joi.string().max(255).optional().messages({
      "string.empty": "Username cannot be empty.",
    }),
    password: Joi.string().min(6).optional().messages({
      "string.min": "Password must be at least 6 characters.",
    }),
    roleId: Joi.string().optional(),
  }).min(1);


const userSchema = Joi.object({
  id: Joi.string().uuid(),
  email: Joi.string().email(),
  username: Joi.string(),
  role: Joi.object({ id: Joi.string(), name: Joi.string() }).allow(null),
  lastLoginAt: Joi.date().allow(null),
  createdAt: Joi.date(),
});

export const getAllUsersResponseSchema = Joi.object({
  items: Joi.array().items(userSchema),
  meta: Joi.object({
    total: Joi.number().integer(),
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
    totalPages: Joi.number().integer(),
  }),
});
export const getUserByIdResponseSchema = userSchema;
export const createUserResponseSchema = userSchema;
export const updateUserResponseSchema = userSchema;
export const deleteUserResponseSchema = Joi.object({
  id: Joi.string().uuid(),
  email: Joi.string().email(),
  username: Joi.string(),
});
