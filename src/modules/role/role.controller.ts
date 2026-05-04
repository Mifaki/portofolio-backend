import * as R from "@/utils/response";
import * as RoleService from "./role.service";

import { Request, Response } from "express";
import { createRoleSchema, getRolesQuerySchema, updateRoleSchema } from "./role.dto";

export async function getAllRolesHandler(req: Request, res: Response) {
  const { error, value } = getRolesQuerySchema.validate(req.query);
  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }
  const result = await RoleService.getAllRoles(value);
  R.ok(res, "List of all roles", result);
}

export async function getRoleByIdHandler(req: Request, res: Response) {
  const role = await RoleService.getRoleById(req.params.id as string);
  R.ok(res, "Role retrieved successfully", role);
}

export async function createRoleHandler(req: Request, res: Response) {
  const { error, value } = createRoleSchema.validate(req.body);
  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }
  const role = await RoleService.createRole(value);
  R.created(res, "Role created successfully", role);
}

export async function updateRoleHandler(req: Request, res: Response) {
  const { error, value } = updateRoleSchema.validate(req.body);
  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }
  const role = await RoleService.updateRole(req.params.id as string, value);
  R.ok(res, "Role updated successfully", role);
}

export async function deleteRoleHandler(req: Request, res: Response) {
  const role = await RoleService.deleteRole(req.params.id as string);
  R.ok(res, "Role deleted successfully", role);
}
