//Import this from mongo
import mongoose from "mongoose";

const MAX_AMOUNT = 1_000_000_000;

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
            trim: true,
            lowercase: true,
            maxlength: 320,
        },
        monthlyGoal: {
            type: Number,
            default:null,
            min: 0,
            max: MAX_AMOUNT,
        },
        wantsReminders: {
            type: String,
            enum: ["yes", "not-now", null],
            default: null,
        },
        preferredChannel: {
            type: String,
            enum: ["discord", "telegram", "none", null],
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
        telegramUserId: {
            type: String,
            default: null,
            index: true,
            sparse: true,
        },
        telegramUsername: {
            type: String,
            default: null,
            trim: true,
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
        },
        emailIngestionToken: {
            type: String,
            default: null,
            minlength: 32,
            maxlength: 128,
            select: false,
        },
        emailIngestionTokenHash: {
            type: String,
            default: null,
            match: /^[a-f0-9]{64}$/,
        },
        emailIngestionEnabled: {
            type: Boolean,
            default: false,
        },
        emailIngestionCreatedAt: {
            type: Date,
            default: null,
        },
        emailIngestionLastReceivedAt: {
            type: Date,
            default: null,
        }
    }
)

userProfileSchema.index(
    { emailIngestionTokenHash: 1 },
    {
        unique: true,
        partialFilterExpression: {
            emailIngestionTokenHash: { $type: "string" },
        },
    },
);

export const UserProfile = mongoose.model("UserProfile", userProfileSchema);
