import express from "express";
import { registerUser } from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.middleware.js"; // ✅ Correct import

const router = express.Router();

// ✅ Correct Multer Middleware Usage
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverimage", maxCount: 1 }
    ]),
    registerUser
);

// ✅ Export the router
export default router;
