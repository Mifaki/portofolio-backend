import * as R from "@/utils/response";

import { CreateUserSchema, UpdateUserDto, UpdateUserSchema } from "./user.dto";
import { Request, Response } from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "./user.service"

export async function getAllUsersHandler(req: Request, res: Response) { 
    const users = await getAllUsers();
    R.ok(res, "List of all users", users);
}

export async function createUserHandler(req: Request, res: Response) { 
    const { error, value } = CreateUserSchema.validate(req.body);
    
    if (error) {
        R.badRequest(res, error.message);
        return;
    }
    
    const user = await createUser(value);
    R.created(res, "User created successfully", user);
}

export async function getUserByIdHandler(req: Request, res: Response) { 
    const { id } = req.params;
    const user = await getUserById(Number(id));
    R.ok(res, "User reterived successfully", user);
}

export async function updateUserHandler(req: Request, res: Response) {  
    const { id } = req.params;

    const { error, value } = UpdateUserSchema.validate(req.body);
    
    if (error) {
        R.badRequest(res, error.message);
        return;
    }   
    
    const user = await updateUser(Number(id), value);
    R.ok(res, "User updated successfully", user);
}

export async function deleteUserHandler(req: Request, res: Response) { 
    const { id } = req.params;
    const user = await deleteUser(Number(id));
    R.ok(res, "User deleted successfully", user);
}