// user Expenses

import mongoose from "mongoose";

const VALID_CATEGORIES = [
  "Housing", "Shopping", "Utilities", "Food & Drink",
  "Income", "Transport", "Dining", "Subscriptions", "Other",
];
const MAX_NAME_LENGTH = 200;
const MAX_AMOUNT = 1_000_000_000;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const dataSchema = new mongoose.Schema({
    
    workosUserId: {
      type: String,
      required: true,
      index: true,
    },
    name:{
        type: String,
        required: true,
        trim: true,
        maxlength: MAX_NAME_LENGTH,
        index: true,
    },
    category:{
        type: String,
        required: true,
        enum: VALID_CATEGORIES,
        trim: true,
    },
    amount:{
        type:Number,
        required: true,
        min: -MAX_AMOUNT,
        max: MAX_AMOUNT,
    },
    date: {
      type: String,
      required: true,
      match: DATE_REGEX,
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
