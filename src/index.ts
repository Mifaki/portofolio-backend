import "dotenv/config";

import { cors } from "./middleware/cors";
import express, { Express } from "express";
import registerModule from "./config/register-module";

const app: Express = express();

app.use(express.json());
app.use(cors)

registerModule(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on <http://localhost:${PORT}> 🚀`);
});

export default app;
