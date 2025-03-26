import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandlers.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"; // ✅ Correct (uppercase 'User')


export const  verifyJWT =  asyncHandler(async(req,_,next) => {
   try {
    const token = req.cookies?.accessToken || req.header
     ("Authorization")?.replace("Bearer ", "")
 
 if (!token){
     throw  new ApiError(401, "unauthorized request")
 }
 
 const decodedToken = jwt.verify(token, proccess.env.
 ACCESS_TOKEN_SECRET)
 
 await User.findById (decodedToken?._id).
 select("-password -refreshToken")
 
 if (!user){
     throw new ApiError(401,"invalid access token")
 }
 
 req.user=user
 next()
 
   } catch (error) {
    throw new ApiError(401,"error?.message" ||
        "invalid access token"
    )
   }


})

