// user Expenses

import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    
    workosUserId: {
      type: String,
      required: true,
      index: true,
    },
    name:{
        type: String,
        required: true,
        index: true,
    },
    category:{
        type: String,
        required: true,
        trim: true,
    },
    amount:{
        type:Number,
        required: true,
    },
    date: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ["dashboard", "telegram"],
      default: "dashboard",
      index: true,
    },
    telegramChatId: {
      type: String,
      default: null,
      index: true,
    },
    telegramUserId: {
      type: String,
      default: null,
      index: true,
    },
    telegramMessageId: {
      type: String,
      default: null,
      index: true,
    },
  },
  { timestamps: true },)

dataSchema.index(
  { telegramChatId: 1, telegramMessageId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      source: "telegram",
      telegramChatId: { $type: "string" },
      telegramMessageId: { $type: "string" },
    },
  },
);

export const Transaction = mongoose.model("Transaction", dataSchema)
