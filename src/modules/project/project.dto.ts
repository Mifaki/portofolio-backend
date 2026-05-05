import Joi from "joi";
import { PaginationQuery, paginationSchema } from "@/utils/pagination";

export interface GetProjectsQueryDto extends PaginationQuery {
  q?: string;
}

export const getProjectsQuerySchema = paginationSchema.keys({
  q: Joi.string().trim().optional(),
});

export interface ProjectTextInput {
  content: string;
  position: number;
}

export interface ProjectImageDto {
  imageUrl: string;
  type: "thumbnail" | "normal";
  orientation: "landscape" | "portrait";
}

export interface CreateProjectDto {
  position: number;
  title: string;
  category: string;
  type: string;
  year: string;
  texts?: ProjectTextInput[];
  images?: ProjectImageDto[];
}

export interface UpdateProjectDto {
  position?: number;
  title?: string;
  category?: string;
  type?: string;
  year?: string;
  texts?: ProjectTextInput[];
  images?: ProjectImageDto[];
}

const textInputSchema = Joi.object({
  content: Joi.string().min(1).required(),
  position: Joi.number().integer().min(0).required(),
});

const imageSchema = Joi.object({
  imageUrl: Joi.string().uri().required(),
  type: Joi.string().valid("thumbnail", "normal").required(),
  orientation: Joi.string().valid("landscape", "portrait").required(),
});

const imagesSchema = Joi.array().items(imageSchema).custom((images, helpers) => {
  const thumbnails = images.filter((img: ProjectImageDto) => img.type === "thumbnail");
  if (thumbnails.length > 1) return helpers.error("any.invalid");
  return images;
}).messages({ "any.invalid": "A project can only have one thumbnail image" });

export const createProjectSchema = Joi.object<CreateProjectDto>({
  position: Joi.number().integer().min(0).required(),
  title: Joi.string().max(255).required(),
  category: Joi.string().max(100).required(),
  type: Joi.string().max(100).required(),
  year: Joi.string().length(4).pattern(/^\d{4}$/).required(),
  texts: Joi.array().items(textInputSchema).optional(),
  images: imagesSchema.optional(),
});

export const updateProjectSchema = Joi.object<UpdateProjectDto>({
  position: Joi.number().integer().min(0).optional(),
  title: Joi.string().max(255).optional(),
  category: Joi.string().max(100).optional(),
  type: Joi.string().max(100).optional(),
  year: Joi.string().length(4).pattern(/^\d{4}$/).optional(),
  texts: Joi.array().items(textInputSchema).optional(),
  images: imagesSchema.optional(),
}).min(1);

const projectTextSchema = Joi.object({
  id: Joi.string().uuid(),
  type: Joi.string().valid("headline", "regular"),
  position: Joi.number().integer(),
  content: Joi.string(),
});

const projectImageSchema = Joi.object({
  id: Joi.string().uuid(),
  type: Joi.string().valid("thumbnail", "normal"),
  orientation: Joi.string().valid("landscape", "portrait"),
  imageUrl: Joi.string().uri(),
});

const projectSchema = Joi.object({
  id: Joi.string().uuid(),
  position: Joi.number().integer(),
  title: Joi.string(),
  category: Joi.string(),
  type: Joi.string(),
  year: Joi.string(),
  createdAt: Joi.date(),
  modifiedAt: Joi.date(),
  texts: Joi.array().items(projectTextSchema),
  images: Joi.array().items(projectImageSchema),
});

export const getAllProjectsResponseSchema = Joi.object({
  items: Joi.array().items(projectSchema),
  meta: Joi.object({
    total: Joi.number().integer(),
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
    totalPages: Joi.number().integer(),
  }),
});
export const getProjectByIdResponseSchema = projectSchema;
export const createProjectResponseSchema = projectSchema;
export const updateProjectResponseSchema = projectSchema;
export const deleteProjectResponseSchema = Joi.object({
  id: Joi.string().uuid(),
  title: Joi.string(),
});

export interface UpdateProjectPositionDto {
  projectId: string;
  originalPosition: number;
  newPosition: number;
}

export const updateProjectPositionSchema = Joi.object<UpdateProjectPositionDto>({
  projectId: Joi.string().uuid().required(),
  originalPosition: Joi.number().integer().min(0).required(),
  newPosition: Joi.number().integer().min(0).required(),
});

export const updateProjectPositionResponseSchema = projectSchema;
