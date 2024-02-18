import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./Routes/authrouter.js";
import userrouter from "./Routes/userrouter.js";
import cookieParser from "cookie-parser";
import listingrouter from "./Routes/listingrouter.js";
// import path from 'path';

dotenv.config();

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to MongoDB...");
}).catch((err) => {
    console.log(err);
});

// const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", router);
app.use("/api/user", userrouter);
app.use("/api/listing", listingrouter)

// app.use(express.static(path.join(__dirname, '/client/dist')));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// })

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error...";

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

app.listen(3000, () => {
    console.log("Run Port 3000...");
});
