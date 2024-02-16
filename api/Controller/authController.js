import user from "../Model/user.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/errorHandler.js";
import Jwt from "jsonwebtoken";

// Sign Up:
export const authController = async (req, res, next) => {

    const { username, email, password } = req.body;

    const HashPassword = await bcrypt.hash(password, 10);

    try {
        const userData = await user.create({
            username,
            email,
            password: HashPassword
        })
        console.log(userData);
        res.status(201).json(userData);
    }
    catch (err) {
        next(errorHandler(551, "Data Already Exits..."));
    }
}

// Sign In:
export const signin = async (req, res, next) => {

    const { email, password } = req.body;

    try {
        const emailCheck = await user.findOne({ email: email });
        if (!emailCheck) {
            return next(errorHandler(404, "User Not Found..."));
        }

        const passwordCompare = await bcrypt.compare(password, emailCheck.password);
        if (!passwordCompare) {
            return next(errorHandler(401, "Wrong User Password..."));
        }

        const token = Jwt.sign({ _id: emailCheck._id }, process.env.JWT_KEY, { expiresIn: process.env.ACCESSTOKEN_EXPIRATION });

        const refreshToken = Jwt.sign({ _id: emailCheck._id }, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESHTOKEN_EXPIRATION })
        emailCheck.refreshToken = refreshToken;
        await emailCheck.save({ validateBeforeSave: false });

        res.cookie("access_token", token, { httpOnly: true })
            .cookie("refresh_token", refreshToken, { httpOnly: true })
            .status(200)
            .json(emailCheck)
    }
    catch (error) {
        next(error);
    }
}

// Google:
export const google = async (req, res, next) => {

    try {
        const useremail = await user.findOne({ email: req.body.email });

        if (useremail) {
            const token = Jwt.sign({ _id: useremail._id }, process.env.JWT_KEY, { expiresIn: process.env.ACCESSTOKEN_EXPIRATION });

            const refreshToken = Jwt.sign({ _id: useremail._id }, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESHTOKEN_EXPIRATION })
            useremail.refreshToken = refreshToken;
            await useremail.save({ validateBeforeSave: false });
    
            const { password: pass, ...rest } = useremail._doc;

            res.cookie('access_token', token, { httpOnly: true }).cookie("refresh_token", refreshToken, { httpOnly: true }).status(200).json(rest);
        }
        else {
            const genPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const HashPassword = await bcrypt.hash(genPassword, 10);

            const newUser = await user.create({
                username: req.body.name,
                email: req.body.email,
                password: HashPassword,
                avatar: req.body.photo
            })
            console.log(newUser);

            const token = Jwt.sign({ _id: newUser._id }, process.env.JWT_KEY, { expiresIn: process.env.ACCESSTOKEN_EXPIRATION });

            const refreshToken = Jwt.sign({ _id: useremail._id }, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESHTOKEN_EXPIRATION })
            
            useremail.refreshToken = refreshToken;
            await useremail.save({ validateBeforeSave: false });

            const { password: pass, ...rest } = newUser._doc;

            res.cookie('access_token', token, { httpOnly: true }).cookie("refresh_token", refreshToken, { httpOnly: true }).status(200).json(rest);
        }
    }
    catch (error) {
        next(error);
    }
}

