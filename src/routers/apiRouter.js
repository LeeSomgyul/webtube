import express from "express";
import {viewUpgrade} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", viewUpgrade);

export default apiRouter;