import mongoose, { Schema } from "mongoose";

const videoSchema = new mongoose.Schema({
    videoUrl: {type: String, required: true},
    thumbnailUrl : {type: String, required: true},
    title: {type: String, required: true, trim: true, maxLength: 20},
    description: {type: String, required: true, trim: true},
    createdAt: {type: String,  required: true},
    hastages: [{type: String, trim: true}],
    meta: {
        views: {type: Number, default:0, required: true},
    },
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
});

videoSchema.static("hashtagesSave", function(hastages){
    return hastages.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
});

videoSchema.static("createAtSave", function(today){
	return today.toLocaleDateString();
});


const Video = mongoose.model("Video", videoSchema);
export default Video;