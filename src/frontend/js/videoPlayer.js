const video = document.querySelector("video");
const playBtn = document.getElementById("playBtn");
const muteBtn = document.getElementById("muteBtn");
const volumeRange = document.getElementById("volumeRange");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeRange = document.getElementById("timeRange");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const videoContainer = document.getElementById("videoContainer");
const videoController = document.getElementById("videoController");

let mouseTimeout = null;
let controlsTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlay = (event) => {
    if(video.paused){
        video.play();
        playBtn.innerText = "정지";
    }else{
        video.pause();
        playBtn.innerText = "재생";
    }
};

const handleMute = (event) => {
    if(video.muted){
        video.muted = false;
        muteBtn.innerText = "음소거";
        volumeRange.value = volumeValue;
    }else{
        video.muted = true;
        muteBtn.innerText = "음소거 해제";
        volumeRange.value = 0;
    }
};

const handleVolumeChange = (event) => {
    const volumeRange = event.target.value;
    if(video.muted){//음소거 상태에서 range를 움직이면 음소거 해제
        video.muted = false;
        muteBtn.innerText = "음소거";
    }
    if(volumeRange == 0){
        muteBtn.innerText = "음소거 해제";
    }else{
        muteBtn.innerText = "음소거";
    }
    volumeValue = volumeRange;
    video.volume = volumeRange;
};

const clockForm = (seconds) => 
    new Date(seconds*1000).toISOString().substring(11, 19);


const timeMetaData = (event) => {
    totalTime.innerText = clockForm(Math.floor(video.duration));
    timeRange.max = Math.floor(video.duration);
};

const currentTimeupdate = (event) => {
    currentTime.innerText = clockForm(Math.floor(video.currentTime));
    timeRange.value = Math.floor(video.currentTime);
};

const handleTimeChange = (event) => {
    const clockRange = event.target.value;
    video.currentTime = clockRange;
};

const handleFullscreen = (event) => {
    if(!document.fullscreenElement){
        videoContainer.requestFullscreen();
    }else{
        document.exitFullscreen();
    }
};

const FullscreenInnertext = (event) => {
    if(!document.fullscreenElement){
        fullscreenBtn.innerText = "전체화면";
    }else{
        fullscreenBtn.innerText = "기본화면";
    }
};

const mousemove = (event) => {
    if(controlsTimeout){
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(mouseTimeout){
        clearTimeout(mouseTimeout);
        mouseTimeout = null;
    }
    videoController.classList.add("showing");
    mouseTimeout = setTimeout(() => {videoController.classList.remove("showing");}, 3000);
};

const mouseleave = (event) => {
    controlsTimeout = setTimeout(() => {videoController.classList.remove("showing");}, 3000);
};

const viewUpgrade = () => {
    const {videoid} = videoContainer.dataset;
    fetch(`/api/videos/${videoid}/view`, {
        method: "POST",
    });
};

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", timeMetaData);
video.addEventListener("timeupdate", currentTimeupdate);
video.addEventListener("ended", viewUpgrade);
timeRange.addEventListener("input", handleTimeChange);
fullscreenBtn.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("fullscreenchange", FullscreenInnertext);
video.addEventListener("mousemove", mousemove);
video.addEventListener("mouseleave", mouseleave);
