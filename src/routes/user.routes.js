import { upload } from "../middlewares/multer.middleware.js";
import express from "express";
import { registerUser} from "../controllers/user.controllers.js";
import {loginuser} from "../controllers/user.controllers.js"
import { logoutUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = express.Router();
router.post("/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginuser)
//secured route
router.route("/logout").post(verifyJWT,  logoutUser)

export default router;