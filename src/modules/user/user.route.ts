import { authenticate, authorize } from "@/middleware/auth";
import {
  createUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
} from "./user.controller";

import { Router } from "express";
import { wrapRouter } from "@/utils/wrap-router";

const router = Router();

router.get("/", getAllUsersHandler);

router.use(authenticate);
router.post("/", authorize("ADMIN"), createUserHandler);
router.get("/:id", authorize("ADMIN"), getUserByIdHandler);
router.put("/:id", authorize("ADMIN"), updateUserHandler);
router.delete("/:id", authorize("ADMIN"), deleteUserHandler);

export default wrapRouter(router);
