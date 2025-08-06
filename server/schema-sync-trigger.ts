import express from "express";
import { registerRoutes } from "../server/routes";
import { default as serverlessExpress } from "@vendia/serverless-express";

const app = express();
registerRoutes(app);

export default serverlessExpress({ app }); 