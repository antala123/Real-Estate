import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "https://img.freepik.com/premium-vector/people-saving-money_24908-51569.jpg" }
}, { timestamps: true })

export default mongoose.model("User", userSchema);