import { Router } from "express";
import { authenticate, authorize } from "@/middleware/auth";
import { wrapRouter } from "@/utils/wrap-router";
import {
  createRoleHandler,
  deleteRoleHandler,
  getAllRolesHandler,
  getRoleByIdHandler,
  updateRoleHandler,
} from "./role.controller";

const router = Router();

router.get("/", getAllRolesHandler);

router.use(authenticate);

router.get("/:id", authorize("ADMIN"), getRoleByIdHandler);
router.post("/", authorize("ADMIN"), createRoleHandler);
router.put("/:id", authorize("ADMIN"), updateRoleHandler);
router.delete("/:id", authorize("ADMIN"), deleteRoleHandler);

export default wrapRouter(router);
