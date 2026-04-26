import { Application } from "express";
import userRoute from "@/modules/user/user.route";

export default (app: Application) => {
  app.use('/users', userRoute);
};
