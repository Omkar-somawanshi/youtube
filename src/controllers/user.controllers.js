import asyncHandler from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt  from "jsonwebtoken"



const generateAccessAndRefreshToken = async (userId) => {
    try {
        console.log(" Fetching user with ID:", userId);
        const user = await User.findById(userId);

        if (!user) {
            console.error(" User not found for ID:", userId);
            throw new ApiError(404, "User not found");
        }

        console.log(" User object:", user);

        console.log(" Generating Access Token...");
        const accessToken = user.generateAccessToken();
        console.log(" Access Token:", accessToken);

        console.log(" Generating Refresh Token...");
        const refreshToken = user.generateRefreshToken();
        console.log(" Refresh Token:", refreshToken);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error(" Error generating tokens:", error);
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;

    // Validate input fields
    if ([fullName, username, email, password].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    // Handle avatar and cover image file paths (optional)
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

    // Upload avatar and cover image to Cloudinary if they exist
    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : null;
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    // Create the user in the database
    const user = await User.create({
        fullName,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // Retrieve the created user without sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Failed to register user");
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log("Login request for email:", email);

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    let user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    console.log("Checking password...");
    if (!(await user.isPasswordValid(password))) {
        throw new ApiError(401, "Invalid user credentials");
    }

    console.log("Generating tokens...");
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: "" } }, { new: true });

    const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});



const refreshAccessToken=asyncHandler(async(req,res) => {
    refreshToken || req.body.refreshToken

    if (incomingRefreshToken){
    throw new ApiError(401,"unauthorized request")
}
   try {
     const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
 
     )
 
 
   const user = await User.findById(decodedToken?._id)
     
   
   if (!user){
     throw new ApiError(401,"invalid refresh token")
   }
 
 
   if(incomingRefreshToken !== user?.refreshToken){
     throw  new ApiError(401,"refresh token is expired or used")
   }
 
   const options={
     httpOnly:true,
     secure:true
   }
 
 
   const {accessToken, newrefreshToken} = await
   generateAccessAndRefreshToken(user._id)
 
 return res
 .status(200)
 .cookie("accessToken",accessToken,options)
 .cookie("refreshToken",newrefreshToken,options)
 .json(
     new ApiResponse(
         200,
         {accessToken,refreshToken:newrefreshToken},
         "access token refreshed"
     )
 )
   } catch (error) {
    throw new ApiError(401,error?.message ||
        "invalid refresh token"
    )
    
   }

})
export { registerUser, loginUser, logoutUser, refreshAccessToken };
