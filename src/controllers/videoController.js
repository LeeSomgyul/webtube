import User from "../models/User";
import Video from "../models/Video";


//[홈페이지]
export const home = async(req, res) => {
    const videos = await Video.find({}).sort({createdAt: "desc"}).populate("owner");//날짜 최신순 정렬
    return res.render("home", {pageTitle: "홈", videos});
};

//[비디오 시청]
export const watch = async(req, res) => {
    const id = req.params.id;
    const video = await Video.findById(id).populate("owner");
    console.log(video);
    if(!video){//잘못된 id로 된 url로 들어갔을 경우
        return res.status(404).render("404", {pageTitle: "404"});
    }
    return res.render("watch", {pageTitle: video.title, video: video});
};

//[비디오 수정]
export const getEdit = async(req, res) => {
    const id = req.params.id;
    const video = await Video.findById(id);
    if(!video){//잘못된 id로 된 url로 들어갔을 경우
        return res.status(404).render("404", {pageTitle: "404"});
    }
    return res.render("edit", {pageTitle: `편집: ${video.title}`, video: video});
};

export const postEdit = async(req, res) => {
    const id = req.params.id;
    const video = await Video.findById(id);
    const {title, description, hastages} = req.body;
    if(!video){//잘못된 id로 된 url로 들어갔을 경우
        return res.status(404).render("404", {pageTitle: "404"});
    }
    await Video.findByIdAndUpdate(id, {
        title: title,
        description: description,
        hastages: Video.hashtagesSave(hastages),
    })
    return res.redirect(`/videos/${id}`);
};

//[비디오 업로드]
export const getUpload = (req, res) => {
    if(!req.session.loggedIn){
        return res.render("uploadprotect", {pageTitle: "비디오 업로드"});
    }
    return res.render("upload", {pageTitle: "비디오 업로드"});
};

export const postUpload = async(req, res) => {
    const id = req.session.user._id;
    const {video, thumbnail} = req.files;
    console.log(video, thumbnail);
    const {title, description, hastages} = req.body;
    const today = new Date();
    try{
        const newVideo = await Video.create({
            videoUrl: video[0].path,
            thumbnailUrl: thumbnail[0].path.replace(/\\/g, '/'),
            title: title,
            description: description,
            createdAt: Video.createAtSave(today),
            hastages: Video.hashtagesSave(hastages),
            meta: {
                views: 0,
            },
            owner: id,
        });
        const user = await User.findById(id);
        user.videos.push(newVideo._id);
        await user.save();
        return res.redirect("/");
    } catch(error) {
        return res.status(400).render("upload", {pageTitle: "비디오 업로드"});
    }
};

//[비디오 삭제]
export const videoDelete = async(req, res) => {
    const id = req.params.id;
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

//[비디오 찾기]
export const search = async(req, res) => {
    const title = req.query.title;
    let videos = [];
    if(title){
        videos = await Video.find({
            title: {
                $regex: new RegExp(title, "i"),//title이 포함된 글자 모두 검색
            },
        }).populate("owner");
    };
    return res.render("search", {pageTitle: "영상 검색", videos});
};

//[조회수 상승]
export const viewUpgrade = async(req, res) => {
    const id = req.params.id;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};