import { Router } from "express";
import { authenticate, authorize } from "@/middleware/auth";
import { wrapRouter } from "@/utils/wrap-router";
import {
  getAboutHandler,
  createAboutHandler,
  updateAboutHandler,
  deleteAboutHandler,
} from "./about.controller";

const router = Router();

router.get("/", getAboutHandler);

router.use(authenticate);

router.post("/", authorize("ADMIN"), createAboutHandler);
router.put("/", authorize("ADMIN"), updateAboutHandler);
router.delete("/", authorize("ADMIN"), deleteAboutHandler);

export default wrapRouter(router);
