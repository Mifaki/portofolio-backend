import { NextFunction, Request, Response, Router } from "express";

export function wrapRouter(router: Router): Router {
  router.stack.forEach((layer) => {
    if (!layer.route) return;
    layer.route.stack.forEach((handleLayer) => {
      const orig = handleLayer.handle;
      if (orig.length === 3 || orig.length === 4) {
        handleLayer.handle = (
          req: Request,
          res: Response,
          next: NextFunction,
        ) => {
          Promise.resolve(orig(req, res, next)).catch(next);
        };
      }
    });
  });
  return router;
}
