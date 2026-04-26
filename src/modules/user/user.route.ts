import { createUserHandler, deleteUserHandler, getAllUsersHandler, getUserByIdHandler, updateUserHandler } from "./user.controller";

import { Router } from "express";
import { wrapRouter } from "@/utils/wrap-router";

const router = Router();

router.get("/", getAllUsersHandler);
router.get("/:id", getUserByIdHandler);
router.post("/", createUserHandler);
router.put("/:id", updateUserHandler);
router.delete("/:id", deleteUserHandler);

export default wrapRouter(router);
