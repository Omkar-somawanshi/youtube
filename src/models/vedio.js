import mongoose,{Schema} from "mongoose";
const mongooseAggregatePaginate= from
 "mongoose-aggregate-paginate-v2";

const vedioSchema =new Schema(
    {
        vediofile:{
            type:string,//cloudinary url
            required:true            
        },
        thumbnail:{
            type:string,//cloudinary url
            required:true
        },
       tittle:{
            type:string,
            required:true
        },
        discription:{
            type:string,
            required:true
        },
        duration:{
            type:Number,
            required:true
        },
        views:{
            type:Number,
            default:0      
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps:true
    }




    
    

    

)
vedioSchema.plugin(mongooseAggregatePaginate)


export const Vedio =mongoose.model("vedio",vedioSchema)