import express from "express";
import { createlisting, deletelisting, getlisting, getlistingitem, updatelisting } from "../Controller/listingController.js";
import { verifyUserToken } from "../utils/verifyUser.js";


const router = express.Router();

router.post("/create", verifyUserToken, createlisting)
router.delete("/delete/:id", verifyUserToken, deletelisting)
router.put("/update/:id", verifyUserToken, updatelisting)
router.get("/get/:id", getlisting)
router.get("/get", getlistingitem)


export default router;