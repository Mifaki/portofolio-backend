import Joi, { ObjectSchema } from "joi";

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
