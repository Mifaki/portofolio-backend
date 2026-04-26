import Joi from "joi";

export interface CreateUserDto {
    name: string;
    email: string;
}

export const CreateUserSchema = Joi.object<CreateUserDto>({
    name: Joi.string().max(255).required(),
    email: Joi.string().email().required(),
})

export interface UpdateUserDto {
    name: string;
    email: string;
}

export const UpdateUserSchema= Joi.object<UpdateUserDto>({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
})