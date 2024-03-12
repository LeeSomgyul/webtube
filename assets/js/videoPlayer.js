/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/frontend/js/videoPlayer.js":
/*!****************************************!*\
  !*** ./src/frontend/js/videoPlayer.js ***!
  \****************************************/
/***/ (() => {

eval("const video = document.querySelector(\"video\");\nconst playBtn = document.getElementById(\"playBtn\");\nconst muteBtn = document.getElementById(\"muteBtn\");\nconst volumeRange = document.getElementById(\"volumeRange\");\nconst currentTime = document.getElementById(\"currentTime\");\nconst totalTime = document.getElementById(\"totalTime\");\nconst timeRange = document.getElementById(\"timeRange\");\nconst fullscreenBtn = document.getElementById(\"fullscreenBtn\");\nconst videoContainer = document.getElementById(\"videoContainer\");\nconst videoController = document.getElementById(\"videoController\");\nlet mouseTimeout = null;\nlet controlsTimeout = null;\nlet volumeValue = 0.5;\nvideo.volume = volumeValue;\nconst handlePlay = event => {\n  if (video.paused) {\n    video.play();\n    playBtn.innerText = \"정지\";\n  } else {\n    video.pause();\n    playBtn.innerText = \"재생\";\n  }\n};\nconst handleMute = event => {\n  if (video.muted) {\n    video.muted = false;\n    muteBtn.innerText = \"음소거\";\n    volumeRange.value = volumeValue;\n  } else {\n    video.muted = true;\n    muteBtn.innerText = \"음소거 해제\";\n    volumeRange.value = 0;\n  }\n};\nconst handleVolumeChange = event => {\n  const volumeRange = event.target.value;\n  if (video.muted) {\n    //음소거 상태에서 range를 움직이면 음소거 해제\n    video.muted = false;\n    muteBtn.innerText = \"음소거\";\n  }\n  if (volumeRange == 0) {\n    muteBtn.innerText = \"음소거 해제\";\n  } else {\n    muteBtn.innerText = \"음소거\";\n  }\n  volumeValue = volumeRange;\n  video.volume = volumeRange;\n};\nconst clockForm = seconds => new Date(seconds * 1000).toISOString().substring(11, 19);\nconst timeMetaData = event => {\n  totalTime.innerText = clockForm(Math.floor(video.duration));\n  timeRange.max = Math.floor(video.duration);\n};\nconst currentTimeupdate = event => {\n  currentTime.innerText = clockForm(Math.floor(video.currentTime));\n  timeRange.value = Math.floor(video.currentTime);\n};\nconst handleTimeChange = event => {\n  const clockRange = event.target.value;\n  video.currentTime = clockRange;\n};\nconst handleFullscreen = event => {\n  if (!document.fullscreenElement) {\n    videoContainer.requestFullscreen();\n  } else {\n    document.exitFullscreen();\n  }\n};\nconst FullscreenInnertext = event => {\n  if (!document.fullscreenElement) {\n    fullscreenBtn.innerText = \"전체화면\";\n  } else {\n    fullscreenBtn.innerText = \"기본화면\";\n  }\n};\nconst mousemove = event => {\n  if (controlsTimeout) {\n    clearTimeout(controlsTimeout);\n    controlsTimeout = null;\n  }\n  if (mouseTimeout) {\n    clearTimeout(mouseTimeout);\n    mouseTimeout = null;\n  }\n  videoController.classList.add(\"showing\");\n  mouseTimeout = setTimeout(() => {\n    videoController.classList.remove(\"showing\");\n  }, 3000);\n};\nconst mouseleave = event => {\n  controlsTimeout = setTimeout(() => {\n    videoController.classList.remove(\"showing\");\n  }, 3000);\n};\nconst viewUpgrade = () => {\n  const {\n    videoid\n  } = videoContainer.dataset;\n  fetch(`/api/videos/${videoid}/view`, {\n    method: \"POST\"\n  });\n};\nplayBtn.addEventListener(\"click\", handlePlay);\nmuteBtn.addEventListener(\"click\", handleMute);\nvolumeRange.addEventListener(\"input\", handleVolumeChange);\nvideo.addEventListener(\"loadedmetadata\", timeMetaData);\nvideo.addEventListener(\"timeupdate\", currentTimeupdate);\nvideo.addEventListener(\"ended\", viewUpgrade);\ntimeRange.addEventListener(\"input\", handleTimeChange);\nfullscreenBtn.addEventListener(\"click\", handleFullscreen);\nvideoContainer.addEventListener(\"fullscreenchange\", FullscreenInnertext);\nvideo.addEventListener(\"mousemove\", mousemove);\nvideo.addEventListener(\"mouseleave\", mouseleave);\n\n//# sourceURL=webpack://wetube/./src/frontend/js/videoPlayer.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/frontend/js/videoPlayer.js"]();
/******/ 	
/******/ })()
;