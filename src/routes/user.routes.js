import express from "express"; 

const router = express.Router(); 

import {registerUser} from "../controllers/user.controllers.js";




router.route("/register").post(registerUser)










export default router

