import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get(
  "/",
  (_, res) => {
    res.json({
      status: "ok",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  },
);

export default router;
