import * as R from "@/utils/response";
import * as UserService from "./user.service";

import { Request, Response } from "express";
import { createUserSchema, getUsersQuerySchema, updateUserSchema } from "./user.dto";

export async function getAllUsersHandler(req: Request, res: Response) {
  const { error, value } = getUsersQuerySchema.validate(req.query);
  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }
  const result = await UserService.getAllUsers(value);
  R.ok(res, "List of all users", result);
}

export async function getUserByIdHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  const user = await UserService.getUserById(id);
  R.ok(res, "User retrieved successfully", user);
}

export async function createUserHandler(req: Request, res: Response) {
  const { error, value } = createUserSchema.validate(req.body);

  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }

  const user = await UserService.createUser(value);
  R.created(res, "User created successfully", user);
}

export async function updateUserHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  const { error, value } = updateUserSchema.validate(req.body);

  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }

  const user = await UserService.updateUser(id, value);
  R.ok(res, "User updated successfully", user);
}

export async function deleteUserHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  const user = await UserService.deleteUser(id);
  R.ok(res, "User deleted successfully", user);
}
