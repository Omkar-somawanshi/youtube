import  asyncHandler  from "../utils/asyncHandlers.js";




const registerUser = asyncHandler(async (req,res)=>{
   res.send(200).json({
        message:"ok"
    })
})




export{registerUser}