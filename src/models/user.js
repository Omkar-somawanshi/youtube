import mongoose,{Schema} from"mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema= new Schema(
    {
        username:{
            type:string,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:string,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullname:{
            type:string,
            required:true,
            trim:true,
            index:true
        },
        avtar:{
            type:string,// cloudinary url
            required:true,
        },
        coverImage:{
            type:string,// cloudinary url
        },
        watchHistory:{
            type:Schema.type.ObjectId,
            ref:"vedio"
        },
        password:{
            type:string,
            required:[true,"password is required"]
        },
        refreshToken:{
            type:string

        }
    }
)

//BCRYT HASHING PASSWORD
userSchema.pre("save",async function(next){
    if(this.isModified("password")) return next();

    this.passsword=bcrypt.hash(this.password,10)
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






export const user=mongoose.model("user",userSchema)