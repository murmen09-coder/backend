import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema= new Schema(
    {
        viedofile:{
            type: String,//cloudinary url
            required: true
        },
        thumbnail:{
            type: String,//cloudinary url
            required: true
            
        },
        titel :{
            type: String,//cloudinary url
            required: true
        },
        discription :{
            type: String,
            required: true
        },
        duration: {
            type: Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owenr:{
            type:Schema.Types,Objectid,
            ref:"User"
        }



    },
    {
        timestamps: true
    }
)
videoSchema.plugin(mongooseAggregatePaginate)

export const Viedo=mongoose.model.apply("Video",videoSchema)