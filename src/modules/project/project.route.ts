import { Router } from "express";
import { authenticate, authorize } from "@/middleware/auth";
import { wrapRouter } from "@/utils/wrap-router";
import {
  getAllProjectsHandler,
  getProjectByIdHandler,
  createProjectHandler,
  updateProjectHandler,
  updateProjectPositionHandler,
  deleteProjectHandler,
} from "./project.controller";

const router = Router();

router.get("/", getAllProjectsHandler);
router.get("/:id", getProjectByIdHandler);

router.use(authenticate);

router.post("/", authorize("ADMIN"), createProjectHandler);
router.patch("/position", authorize("ADMIN"), updateProjectPositionHandler);
router.put("/:id", authorize("ADMIN"), updateProjectHandler);
router.delete("/:id", authorize("ADMIN"), deleteProjectHandler);

export default wrapRouter(router);
