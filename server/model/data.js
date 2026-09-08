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
        validate: {
          // Rejects zero-valued transactions at the persistence boundary.
          validator: (value) => value !== 0,
          message: "amount must be non-zero",
        },
    },
    date: {
      type: String,
      required: true,
      match: DATE_REGEX,
    },
    source: {
      type: String,
      enum: ["dashboard", "telegram", "email_rbc"],
      default: "dashboard",
      index: true,
    },
    status: {
      type: String,
      enum: ["posted", "pending", "adjusted", "reversed"],
      default: "posted",
      index: true,
    },
    institution: {
      type: String,
      enum: ["rbc", null],
      default: null,
      index: true,
    },
    currency: {
      type: String,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
      default: "CAD",
    },
    accountLastFour: {
      type: String,
      match: /^\d{4}$/,
      default: null,
    },
    authorizedAmount: {
      type: Number,
      min: 0,
      max: MAX_AMOUNT,
      default: null,
    },
    ingestionConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },
    sourceMessageIdHash: {
      type: String,
      match: /^[a-f0-9]{64}$/,
      default: null,
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

dataSchema.index(
  { workosUserId: 1, sourceMessageIdHash: 1 },
  {
    unique: true,
    partialFilterExpression: {
      source: "email_rbc",
      sourceMessageIdHash: { $type: "string" },
    },
  },
);

export const Transaction = mongoose.model("Transaction", dataSchema)
