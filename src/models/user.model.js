import mongoose,{Schema} from"mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema= new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avtar:{
            type:String,// cloudinary url
            required:true,
        },
        coverImage:{
            type:String,// cloudinary url
        },
        watchHistory:{
            type:Schema.Types.ObjectId,
            ref:"vedio"
        },
        password:{
            type:String,
            required:[true,"password is required"]
        },
        refreshToken:{
            type:String

        }
    }
)

//BCRYT HASHING PASSWORD
userSchema.pre("save",async function(next){
    if(this.isModified("password")) return next();

    this.passsword= await bcrypt.hash(this.password,10)
    next()
})


userSchema.methods.isPasswordCorrect=async function
(password) {
   return await bcrypt.compare(password,this.password)    
}


//JWT TOKEN GENERATION
userSchema.methods.generateAccessToken=function(){
  return  jwt.sign(
        {
            _id:this_id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return  jwt.sign(
        {
            _id:this_id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}






export const User=mongoose.model("user",userSchema)