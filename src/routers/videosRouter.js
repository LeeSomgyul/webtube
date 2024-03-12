import express from "express";
import {watch, getEdit, postEdit, getUpload, postUpload, videoDelete} from "../controllers/videoController";
import {protectorMiddleware, videoMulterMiddleware} from "../middlewares";

const videosRouter = express.Router();

videosRouter.get("/:id([0-9a-f]{24})", watch);//비디오 시청
videosRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);//비디오 수정
videosRouter.route("/:id([0-9a-f]{24})/delete").get(protectorMiddleware, videoDelete);//비디오 삭제
videosRouter
    .route("/upload")
    .get(getUpload)
    .post(videoMulterMiddleware.fields([
        {name: "video", maxCount: 1},
        {name: "thumbnail", maxCount: 1},
    ]), postUpload);//비디오 업로드

export default videosRouter;