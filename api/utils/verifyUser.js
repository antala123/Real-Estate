import Jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";


export const verifyUserToken = (req, res, next) => {
    try {
        const token = req.cookies.access_token;

        if (!token) return next(errorHandler(401, 'Unauthorized'));

        Jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) {
                return next(errorHandler(403, 'Forbidden'));
            }
            req.user = user;
            // console.log(req.user);
            next();
        })
    }
    catch (error) {
        return next(errorHandler("Access token is invalid"));
    }

}



