import Joi from "joi";

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
  texts?: string[];
  images?: ProjectImageDto[];
}

export interface UpdateProjectDto {
  position?: number;
  title?: string;
  category?: string;
  type?: string;
  year?: string;
  texts?: string[];
  images?: ProjectImageDto[];
}

const imageSchema = Joi.object({
  imageUrl: Joi.string().uri().required(),
  type: Joi.string().valid("thumbnail", "normal").required(),
  orientation: Joi.string().valid("landscape", "portrait").required(),
});

export const createProjectSchema = Joi.object<CreateProjectDto>({
  position: Joi.number().integer().min(0).required(),
  title: Joi.string().max(255).required(),
  category: Joi.string().max(100).required(),
  type: Joi.string().max(100).required(),
  year: Joi.string().length(4).pattern(/^\d{4}$/).required(),
  texts: Joi.array().items(Joi.string().min(1)).optional(),
  images: Joi.array().items(imageSchema).optional(),
});

export const updateProjectSchema = Joi.object<UpdateProjectDto>({
  position: Joi.number().integer().min(0).optional(),
  title: Joi.string().max(255).optional(),
  category: Joi.string().max(100).optional(),
  type: Joi.string().max(100).optional(),
  year: Joi.string().length(4).pattern(/^\d{4}$/).optional(),
  texts: Joi.array().items(Joi.string().min(1)).optional(),
  images: Joi.array().items(imageSchema).optional(),
}).min(1);

const projectTextSchema = Joi.object({
  id: Joi.string().uuid(),
  type: Joi.string().valid("headline", "regular"),
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

export const getAllProjectsResponseSchema = Joi.array().items(projectSchema);
export const getProjectByIdResponseSchema = projectSchema;
export const createProjectResponseSchema = projectSchema;
export const updateProjectResponseSchema = projectSchema;
export const deleteProjectResponseSchema = Joi.object({
  id: Joi.string().uuid(),
  title: Joi.string(),
});
