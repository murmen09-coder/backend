import mongoose from "mongoose"
import mangoose, {Schema} from "mongoose"

const subscriptionSchema = new Schema ({
    subscriber:{
        type : Schema.Types.ObjectId, //one who is subscrbing 
        ref:"User"
    },
    channel:{
        type : Schema.Types.ObjectId, //one to who the 'sbuscribinf too'
        ref:"User"
    },

},{timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)