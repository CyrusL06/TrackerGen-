
import express from "express";
import { Transaction } from "../model/data.js"
import {UserProfile}  from "../model/userProfile.js"

console.log("Transaction collection:", Transaction.collection.name);
console.log("UserProfile collection:", UserProfile.collection.name);

const router = express.Router()
router.use(express.urlencoded({extended:true}))

router.get("/api/transactions", async (req,res) => {
    try {
        
        const transactions = await Transaction.find();
        // const userProfile = await UserProfile.find();

        if(transactions.length == 0){
            return res.status(200).json({message: "No Transaction or User Profile Found"})
        }

         res.status(200).json(transactions)

    } catch (error) {
        console.log(`ERROR ${error}`)
        res.status(500).json({message:"Failed to fetch Transactions"})
    }
})

export default router;