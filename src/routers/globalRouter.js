import express from "express";
import { home, search } from "../controllers/videoController";
import { getJoin, postJoin, getLogin, postLogin } from "../controllers/userController";
import {publicOnlyMiddleware} from "../middlewares";

const globalRouter = express.Router();


globalRouter.get("/", home);//홈페이지
globalRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);//회원가입
globalRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);//로그인
globalRouter.get("/search", search);//비디오 찾기

export default globalRouter;