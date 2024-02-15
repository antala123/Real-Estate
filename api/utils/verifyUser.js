import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";
import user from "../Model/user.js";


// export const verifyUserToken = (req, res, next) => {
//     try {
//         const token = req.cookies.access_token;

//         if (!token) return next(errorHandler(401, 'Unauthorized'));

//         Jwt.verify(token, process.env.JWT_KEY, (err, user) => {
//             if (err) {
//                 return next(errorHandler(403, 'Forbidden'));
//             }
//             req.user = user;
//             // console.log(req.user);
//             next();
//         })
//     }
//     catch (error) {
//         return next(errorHandler("Access token is invalid"));
//     }

// }

export const verifyUserToken = async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    let refreshTokens = req.cookies.refresh_token;
    // console.log(accessToken);

    if (!accessToken) {
        const userData = await user.findById({ _id: req.params.id });
        // console.log("user", user);
        if (!refreshTokens) {
            // const user = await User.findById({_id: req.params.id});
            refreshTokens = userData.refreshToken;
        }
        console.log(refreshTokens);

        try {
            const refreshDecoded = jwt.verify(
                refreshTokens,
                process.env.REFRESH_SECRET
            );

            // Generate a new access token
            const newAccessToken = jwt.sign(
                { id: refreshDecoded.id },
                process.env.ACCESS_SECRET,
                { expiresIn: process.env.ACCESSTOKEN_EXPIRATION }
            )

            // Update the access token in the response
            res.cookie('access_token', newAccessToken, { httpOnly: true });

            req.user = refreshDecoded;
            return next();
        } catch (error) {
            return next(errorHandler(401, "Invalid refresh token"));
        }
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);

        // Check if token has expired
        if (decoded.exp * 1000 < Date.now()) {

            if (!refreshTokens) {
                return next(errorHandler(401, "Refresh token not provided"));
            }

            try {
                const refreshDecoded = jwt.verify(
                    refreshTokens,
                    process.env.REFRESH_SECRET
                );

                // Generate a new access token
                const newAccessToken = jwt.sign(
                    { id: refreshDecoded.id },
                    process.env.ACCESS_SECRET,
                    { expiresIn: process.env.ACCESSTOKEN_EXPIRATION }
                )

                // Update the access token in the response
                res.cookie('access_token', newAccessToken, { httpOnly: true });

                req.user = refreshDecoded;
                return next();
            } catch (error) {
                return next(errorHandler(401, "Invalid refresh token"));
            }
        }

        req.user = decoded;
        return next();
    } catch (error) {
        return next(errorHandler(401, "Invalid refresh token"));
    }
}


