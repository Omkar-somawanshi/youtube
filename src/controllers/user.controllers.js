import asyncHandler from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import  {User} from "../models/user.model.js";  // Ensure correct casing
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"; // Ensure correct import

const registerUser = asyncHandler(async (req, res) => {
    // ✅ Correct Response Syntax
    res.status(200).json({
        message: "ok"
    });

    const { fullname, email, username, password } = req.body;
    console.log("email:", email);

    // ✅ Validate Required Fields
    if ([fullname, email, username, password].some(field => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    // ✅ Check if User Already Exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(400, "User already exists");
    }

    // ✅ Handle File Uploads
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverimage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    // ✅ Upload Files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    // ✅ Create New User
    const newUser = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase() // Fixed `.toLowerCase()`
    });

    // ✅ Retrieve User Without Password & Refresh Token
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // ✅ Send Success Response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

export { registerUser };
