import User from "../models/User";
import bcrypt from "bcrypt";

//[회원가입]
export const getJoin = (req, res) => {
    return res.render("join", {pageTitle: "회원가입"});
};

export const postJoin = async(req, res) => {
    const {userId, userPw, username, email, location} = req.body;
    const userIdExists = await User.exists({userId: userId});
    const emailExists = await User.exists({email: email});
    if(userIdExists, emailExists){
        return res.status(400).render("join", {
            pageTitle: "회원가입",
            userErrorMessage: "이미 사용중인 아이디입니다.",
            emailErrorMessage: "이미 사용중인 이메일입니다.",
        });
    }
    if(userIdExists){
        return res.status(400).render("join", {
            pageTitle: "회원가입",
            userErrorMessage: "이미 사용중인 아이디입니다.",
        });
    }
    if(emailExists){
        return res.status(400).render("join", {
            pageTitle: "회원가입",
            emailErrorMessage: "이미 사용중인 이메일입니다.",
        });
    }
    try{
        User.create({
        userId: userId,
        userPw: userPw,
        username: username,
        email: email,
        location: location,
        avatarUrl: "",
        })
        return res.redirect("/login");
    } catch {
        return res.status(404).render("404", {pageTitle: "404"});
    }
};

//[로그인]
export const getLogin = (req, res) => {
    return res.render("login", {pageTitle: "로그인"});
};

export const postLogin = async(req, res) => {
    const {userId, userPw} = req.body;
    const user = await User.findOne({userId: userId, githubLogin: false});
    if(!user){
        return res.status(400).render("login", {
            pageTitle: "로그인",
            userIdErrorMessage: "존재하지 않는 아이디입니다.",
        });
    }
    const loginAccess = await bcrypt.compare(userPw, user.userPw);
    if(!loginAccess){
        return res.status(400).render("login", {
            pageTitle: "로그인",
            userPwErrorMessage: "존재하지 않는 비밀번호입니다.",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

//[깃허브 로그인]
export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: "37ee0b53cd95547558fd",
        scope: "user:email read:user",
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const callbackGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: "37ee0b53cd95547558fd",
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const data = await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    })
    const dataJson = await data.json();
    if("access_token" in dataJson){
        const {access_token} = dataJson;
        const userData = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `token ${access_token}`,
            }
        })
        const accessJson = await userData.json();
        const emailData = await fetch("https://api.github.com/user/emails", {
            headers: {
                Authorization: `token ${access_token}`,
            }
        })
        const emailJson = await emailData.json();
        const emailObj = emailJson.find(
            (array) => array.primary === true && array.verified === true
        );
        if(!emailObj){
            return res.redirect("/login");
        }
        const existingEmail = await User.findOne({email: emailObj.email});
        if(existingEmail){
            req.session.loggedIn = true;
            req.session.user = existingEmail;
            return res.redirect("/");
        }else{
            const newUser = await User.create({
                userId: accessJson.login,
                githubLogin: true,
                userPw: "",
                username: accessJson.login,
                email: emailObj.email,
                location: "",
                avatarUrl: accessJson.avatar_url,
            });
            req.session.loggedIn = true;
            req.session.user = newUser;
            return res.redirect("/");
        }
    }else{
        return res.redirect("/login");
    }
}

//[로그아웃]
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

//[프로필 수정]
export const getEdit = (req, res) => {
    return res.render("editProfile", {pageTitle: "프로필 수정"});
}

export const postEdit = async(req, res) => {
    const {username, email, location} = req.body;
    const file = req.file;
    const avatarUrl = req.session.user.avatarUrl;
    const loginUserId = req.session.user._id;
    //DB업데이트
    const updateUser = await User.findByIdAndUpdate(loginUserId, {
        avatarUrl: file ? file.path : avatarUrl,
        username: username,
        email: email,
        location: location,
    },
    {new: true});
    //session 업데이트
    req.session.user = updateUser;
    return res.redirect("/user/edit");
}

//[비밀번호 변경]
export const getEditPw = (req, res) => {
    if(req.session.user.githubLogin === true){
        return res.status(404).render("404", {pageTitle: "404"});
    }
    return res.render("editPw", {pageTitle: "비밀번호 변경"});
};

export const postEditPw = async(req, res) => {
    const {currentPw, newPw, newPwCheck} = req.body;
    const loginUserPw = req.session.user.userPw;
    const comparePw = await bcrypt.compare(currentPw, loginUserPw);
    if(newPw !== newPwCheck){
        return res.send(`<script>alert('새로운 비밀번호가 다릅니다.');location.href='/user/editPw';</script>`);
    }
    if(!comparePw){
        return res.send(`<script>alert('현재 비밀번호가 다릅니다.');location.href='/user/editPw';</script>`);
    }
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    user.userPw = newPw;
    await user.save();//DB의 비밀번호 변경
    req.session.user.userPw = user.userPw;//session의 비밀번호 변경
    return res.send(`<script>alert('비밀번호가 변경되었습니다.');location.href='/';</script>`);
}

//[프로필 보기]
export const seeProfile = async(req, res) => {
    const id = req.params.id;
    const user = await User.findById(id).populate("videos");
    console.log(user);
    if(!user){
        return res.render("404", {pageTitle: "404"});
    }
    return res.render("myprofile", {pageTitle: user.username, user});
};

//[회원탈퇴]
export const remove = (req, res) => res.send("미완성");