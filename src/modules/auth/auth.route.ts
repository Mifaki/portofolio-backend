import * as AuthCtrl from "@/modules/auth/auth.controller";

import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { wrapRouter } from "@/utils/wrap-router";

const router = Router();
router.post("/login", AuthCtrl.loginRequest);
router.post("/refresh", AuthCtrl.refresh);
router.post("/otp/request", AuthCtrl.requestOtp);
router.post("/otp/verify", AuthCtrl.verifyOtp);

router.use(authenticate);
router.post("/logout", AuthCtrl.logout);

export default wrapRouter(router);
