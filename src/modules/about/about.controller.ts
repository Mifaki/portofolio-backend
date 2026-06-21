import * as AboutService from "./about.service";
import * as R from '../../utils/response';

import { Request, Response } from "express";
import { createAboutSchema, updateAboutSchema } from "./about.dto";

export async function getAboutHandler(_req: Request, res: Response) {
  const about = await AboutService.getAbout();
  R.ok(res, "About retrieved successfully", about);
}

export async function createAboutHandler(req: Request, res: Response) {
  const { error, value } = createAboutSchema.validate(req.body);
  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }
  const about = await AboutService.createAbout(value);
  R.created(res, "About created successfully", about);
}

export async function updateAboutHandler(req: Request, res: Response) {
  const { error, value } = updateAboutSchema.validate(req.body);
  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }
  const about = await AboutService.updateAbout(value);
  R.ok(res, "About updated successfully", about);
}

export async function deleteAboutHandler(_req: Request, res: Response) {
  const result = await AboutService.deleteAbout();
  R.ok(res, "About deleted successfully", result);
}

export async function getTechStackCategoriesHandler(_req: Request, res: Response) {
  const categories = await AboutService.getTechStackCategories();
  R.ok(res, "Categories retrieved successfully", categories);
}
