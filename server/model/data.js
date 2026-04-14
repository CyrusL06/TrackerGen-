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
  },
  { timestamps: true },)


  export const Transaction = mongoose.model("Transaction", dataSchema)