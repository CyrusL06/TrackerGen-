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
        },
        wantsReminders: {
            type: String,
            default: null,
        },
        preferredChannel: {
            type: String,
            default: null,
        },
        hasCompletedOnboarding: {
            type: Boolean,
            default: false,
        },
        completedOnboardingAt: {
            type: Date,
            default: null,
        },
        telegramChatId: {
            type: String,
            default: null,
            index: true,
            sparse: true,
        },
        telegramLinkCode: {
            type: String,
            default: null,
            index: true,
        },
        telegramLinkCodeExpiresAt: {
            type: Date,
            default: null,
        },
        telegramLinkedAt: {
            type: Date,
            default: null,
        }
    }
)

export const UserProfile = mongoose.model("UserProfile", userProfileSchema);
