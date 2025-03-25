import asyncHandler from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;

    // Validate input fields
    if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
           }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }


    // Handle avatar and cover image file paths (optional)
    const avatarLocalPath = req.files?.avatar?.[0]?.path ;
   // const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath =req.files.coverImage[0].path
   }


    // Upload avatar and cover image to Cloudinary if they exist
    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : null;
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    // Create the user in the database
    const user = await User.create({
        fullName,
        avatar: avatar?.url || "", // If avatar is not uploaded, set an empty string
        coverImage: coverImage?.url || "", // If coverImage is not uploaded, set an empty string
        email,
        password,
        username: username.toLowerCase(),
    });

    // Retrieve the created user without sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Failed to register user");
    }

    // Respond with the created user details
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

export { registerUser };
