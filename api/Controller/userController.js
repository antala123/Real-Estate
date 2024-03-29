import { errorHandler } from '../utils/errorHandler.js';
import bcrypt from 'bcrypt';
import User from '../Model/user.js';
import { Listing } from '../Model/listing.model.js';

// Update User:
export const updateUser = async (req, res, next) => {
    if (req.user._id !== req.params.id)
        return next(errorHandler(401, "You can only update your own account!"));

    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true })

        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest);
    }
    catch (error) {
        next(error);
    }
}

// Sign Out:
export const signout = (req, res, next) => {
    // console.log(req.user._id);

    if (!req.user) {
        return next(errorHandler(401, "You must be logged in to sign out"));
    }
    if (req.user._id !== req.params.id) {
        return next(errorHandler(401, "You can only SignOut your own account!"));
    }
    try {
        res.status(200).clearCookie('access_token').json('User sign out Successfully...');
    }
    catch (error) {
        return next(errorHandler(500, "something went wrong while user signOut !"));
    }
}

// Delete User:
export const deleteUser = async (req, res, next) => {
    if (req.user._id !== req.params.id)
        return next(errorHandler(401, 'You can only delete your own account!'));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("Delete Account Successfully...");
    }
    catch (error) {
        next(error);
    }
}

// Show All Listing User:
export const getUserListing = async (req, res, next) => {
    if (req.user._id === req.params.id) {
        try {
            const listinguser = await Listing.find({ userRef: req.params.id })
            res.status(200).json(listinguser);
        }
        catch (error) {
            next(error);
        }
    }
    else {
        return next(errorHandler(401, "User Please Sign in again..."))
    }
}


export const getUser = async (req, res, next) => {

    try {
        const getuserdata = await User.findById(req.params.id);

        if (!getuserdata) {
            return next(errorHandler(404, "User Not Found!"));
        }

        const { password: pass, ...rest } = getuserdata._doc;

        res.status(200).json(rest);
    }
    catch (error) {
        next(error);
    }
}
