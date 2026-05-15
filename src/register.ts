import { register } from "tsconfig-paths";
import path from "path";

register({
  baseUrl: path.resolve(__dirname),
  paths: { "@/*": ["*"] },
});
