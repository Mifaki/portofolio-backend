import Joi from "joi";

export interface DescriptionInput {
  content: string;
  position: number;
}

export interface TechStackInput {
  name: string;
  category: string;
  percentage: number;
  position: number;
}

export interface AboutImageInput {
  imageUrl: string;
  position: number;
}

export interface WorkExperienceInput {
  company: string;
  role: string;
  description?: string;
  location?: string;
  startMonth: number;
  startYear: number;
  endMonth?: number;
  endYear?: number;
  position: number;
}

export interface CreateAboutDto {
  name: string;
  instagram?: string;
  github?: string;
  linkedin?: string;
  descriptions?: DescriptionInput[];
  techStacks?: TechStackInput[];
  images?: AboutImageInput[];
  workExperiences?: WorkExperienceInput[];
}

export interface UpdateAboutDto {
  name?: string;
  instagram?: string | null;
  github?: string | null;
  linkedin?: string | null;
  descriptions?: DescriptionInput[];
  techStacks?: TechStackInput[];
  images?: AboutImageInput[];
  workExperiences?: WorkExperienceInput[];
}

const descriptionInputSchema = Joi.object<DescriptionInput>({
  content: Joi.string().min(1).required(),
  position: Joi.number().integer().min(0).required(),
});

const techStackInputSchema = Joi.object<TechStackInput>({
  name: Joi.string().max(100).required(),
  category: Joi.string().max(100).required(),
  percentage: Joi.number().integer().min(0).max(100).required(),
  position: Joi.number().integer().min(0).required(),
});

const aboutImageInputSchema = Joi.object<AboutImageInput>({
  imageUrl: Joi.string().uri().required(),
  position: Joi.number().integer().min(0).required(),
});

const workExperienceInputSchema = Joi.object<WorkExperienceInput>({
  company: Joi.string().max(255).required(),
  role: Joi.string().max(255).required(),
  description: Joi.string().optional(),
  location: Joi.string().max(255).optional(),
  startMonth: Joi.number().integer().min(1).max(12).required(),
  startYear: Joi.number().integer().min(1900).max(2100).required(),
  endMonth: Joi.number().integer().min(1).max(12).optional(),
  endYear: Joi.number().integer().min(1900).max(2100).optional(),
  position: Joi.number().integer().min(0).required(),
}).and("endMonth", "endYear");

export const createAboutSchema = Joi.object<CreateAboutDto>({
  name: Joi.string().max(255).required(),
  instagram: Joi.string().uri().optional(),
  github: Joi.string().uri().optional(),
  linkedin: Joi.string().uri().optional(),
  descriptions: Joi.array().items(descriptionInputSchema).optional(),
  techStacks: Joi.array().items(techStackInputSchema).optional(),
  images: Joi.array().items(aboutImageInputSchema).optional(),
  workExperiences: Joi.array().items(workExperienceInputSchema).optional(),
});

export const updateAboutSchema = Joi.object<UpdateAboutDto>({
  name: Joi.string().max(255).optional(),
  instagram: Joi.string().uri().allow(null).optional(),
  github: Joi.string().uri().allow(null).optional(),
  linkedin: Joi.string().uri().allow(null).optional(),
  descriptions: Joi.array().items(descriptionInputSchema).optional(),
  techStacks: Joi.array().items(techStackInputSchema).optional(),
  images: Joi.array().items(aboutImageInputSchema).optional(),
  workExperiences: Joi.array().items(workExperienceInputSchema).optional(),
}).min(1);


const aboutDescriptionSchema = Joi.object({
  id: Joi.string().uuid(),
  content: Joi.string(),
  position: Joi.number().integer(),
});

const aboutTechStackSchema = Joi.object({
  id: Joi.string().uuid(),
  name: Joi.string(),
  category: Joi.object({
    id: Joi.string().uuid(),
    name: Joi.string(),
  }),
  percentage: Joi.number().integer().min(0).max(100),
  position: Joi.number().integer(),
});

const aboutImageSchema = Joi.object({
  id: Joi.string().uuid(),
  imageUrl: Joi.string().uri(),
  position: Joi.number().integer(),
});

const workExperienceSchema = Joi.object({
  id: Joi.string().uuid(),
  company: Joi.string(),
  role: Joi.string(),
  description: Joi.string().allow(null),
  location: Joi.string().allow(null),
  startMonth: Joi.number().integer(),
  startYear: Joi.number().integer(),
  endMonth: Joi.number().integer().allow(null),
  endYear: Joi.number().integer().allow(null),
  position: Joi.number().integer(),
});

const aboutSchema = Joi.object({
  id: Joi.string().uuid(),
  name: Joi.string(),
  instagram: Joi.string().uri().allow(null),
  github: Joi.string().uri().allow(null),
  linkedin: Joi.string().uri().allow(null),
  createdAt: Joi.date(),
  modifiedAt: Joi.date(),
  descriptions: Joi.array().items(aboutDescriptionSchema),
  techStacks: Joi.array().items(aboutTechStackSchema),
  images: Joi.array().items(aboutImageSchema),
  workExperiences: Joi.array().items(workExperienceSchema),
});

export const getAboutResponseSchema = aboutSchema;
export const createAboutResponseSchema = aboutSchema;
export const updateAboutResponseSchema = aboutSchema;
export const deleteAboutResponseSchema = Joi.object({
  id: Joi.string().uuid(),
  name: Joi.string(),
});
