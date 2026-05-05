import * as ProjectService from "./project.service";
import * as R from "@/utils/response";

import { Request, Response } from "express";
import { createProjectSchema, getProjectsQuerySchema, updateProjectPositionSchema, updateProjectSchema } from "./project.dto";

export async function getAllProjectsHandler(req: Request, res: Response) {
  const { error, value } = getProjectsQuerySchema.validate(req.query);
  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }
  const result = await ProjectService.getAllProjects(value);
  R.ok(res, "List of all projects", result);
}

export async function getProjectByIdHandler(req: Request, res: Response) {
  const project = await ProjectService.getProjectById(req.params.id as string);
  R.ok(res, "Project retrieved successfully", project);
}

export async function createProjectHandler(req: Request, res: Response) {
  const { error, value } = createProjectSchema.validate(req.body);
  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }
  const project = await ProjectService.createProject(value);
  R.created(res, "Project created successfully", project);
}

export async function updateProjectHandler(req: Request, res: Response) {
  const { error, value } = updateProjectSchema.validate(req.body);
  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }
  const project = await ProjectService.updateProject(req.params.id as string, value);
  R.ok(res, "Project updated successfully", project);
}

export async function updateProjectPositionHandler(req: Request, res: Response) {
  const { error, value } = updateProjectPositionSchema.validate(req.body);
  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }
  const project = await ProjectService.updateProjectPosition(value);
  R.ok(res, "Project position updated successfully", project);
}

export async function deleteProjectHandler(req: Request, res: Response) {
  const project = await ProjectService.deleteProject(req.params.id as string);
  R.ok(res, "Project deleted successfully", project);
}
