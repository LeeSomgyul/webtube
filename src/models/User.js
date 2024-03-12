import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    githubLogin: {type: Boolean, default: false},
    userPw: {type: String},
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    location: {type: String},
    avatarUrl: {type: String},
    videos: [{type: mongoose.Schema.Types.ObjectId, ref: "Video"}],
});

userSchema.pre("save", async function() {
    this.userPw = await bcrypt.hash(this.userPw, 5);
})


const User = mongoose.model("User", userSchema);
export default User;