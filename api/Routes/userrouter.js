import express from "express";
import { deleteUser, getUser, getUserListing, signout, updateUser } from "../Controller/userController.js";
import { verifyUserToken } from "../utils/verifyUser.js";



const router = express.Router();

router.put("/update/:id", verifyUserToken, updateUser);
router.delete("/signout/:id", verifyUserToken, signout);
router.delete("/delete/:id", verifyUserToken, deleteUser);
router.get("/listings/:id", verifyUserToken, getUserListing);
router.get("/:id", verifyUserToken, getUser);

export default router; 