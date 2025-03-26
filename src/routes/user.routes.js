import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerUser, loginUser, logoutUser, refreshAccessToken} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Registration Route with File Upload
router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

// Authentication Routes
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken)

export default router;
