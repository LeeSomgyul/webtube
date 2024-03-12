import express from "express";
import { logout, seeProfile, getEdit, postEdit, remove, startGithubLogin, callbackGithubLogin, getEditPw, postEditPw } from "../controllers/userController";
import {protectorMiddleware, publicOnlyMiddleware, avatarmulterMiddleware} from "../middlewares"

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);//로그아웃
userRouter
    .route("/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(avatarmulterMiddleware.single("avatar"), postEdit);//프로필 수정
userRouter.route("/editPw").all(protectorMiddleware).get(getEditPw).post(postEditPw);//비밀번호 수정
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);//깃허브 로그인
userRouter.get("/github/callback", publicOnlyMiddleware, callbackGithubLogin);//깃허브 로그인(콜백)
userRouter.get("/remove", remove);//회원탈퇴
userRouter.get("/:id", seeProfile)//프로필 보기

export default userRouter;