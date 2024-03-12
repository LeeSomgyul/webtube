import multer from "multer";

//[locals 모음집 미들웨어]
export const localsMiddleware = (req, res, next) => {
    //로그인을 성공했다면 loggedIn변수에 true저장
    if(req.session.loggedIn){
        res.locals.loggedIn = true;
        res.locals.loggedInUser = req.session.user;
    }
    next();
};

//[로그인된 유저만 특정 기능을 사용할 수 있도록 하는 미들웨어]
export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        next();
    }else{
        return res.redirect("/login");
    }
}

//[익명 사용자만 특정 기능을 사용할 수 있도록 하는 미들웨어]
export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        next();
    }else{
        return res.redirect("/");
    }
}

//[multer 미들웨어]
export const avatarmulterMiddleware = multer({
    dest: "uploads/avatars/",
});

export const videoMulterMiddleware = multer({
    dest: "uploads/videos/",
});