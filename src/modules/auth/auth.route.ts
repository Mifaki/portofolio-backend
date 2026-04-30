import * as AuthCtrl from "@/modules/auth/auth.controller";

import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { wrapRouter } from "@/utils/wrap-router";

const router = Router();
router.post("/login", AuthCtrl.loginRequest);
router.post("/refresh", AuthCtrl.refresh);

router.use(authenticate);
router.post("/logout", AuthCtrl.logout);

export default wrapRouter(router);
