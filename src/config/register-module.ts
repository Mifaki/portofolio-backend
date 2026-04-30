import { Application } from "express";
import auth from "@/modules/auth/auth.route";
import userRoute from "@/modules/user/user.route";

export default (app: Application) => {
  app.use('/users', userRoute);
  app.use('/auth', auth);
};
