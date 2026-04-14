//Import this from mongo
import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
    {
        workosUserId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email:{
            type:String,
            required: true,
            trim: true
        },
        monthlyGoal: {
            type: Number,
            default:null,
        }
    }
)

export const UserProfile = mongoose.model("UserProfile", userProfileSchema);
