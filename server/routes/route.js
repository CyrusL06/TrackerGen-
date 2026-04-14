
import express from "express";
import { Transaction } from "../model/data.js"
import {UserProfile}  from "../model/userProfile.js"

//Debug the database collection name
console.log("Transaction collection:", Transaction.collection.name);
console.log("UserProfile collection:", UserProfile.collection.name);

export function buildRouter({getAuthenticatedUser}){
    const router = express.Router()
router.use(express.urlencoded({extended:true}))

router.get("/api/profile", async (req,res) => {
    const user = await getAuthenticatedUser(req,res);

    if(!user){
        return res.status(401).json({message:"Unauthorized User"})
    }

    const profile = await UserProfile.findOne({
        workosUserId: user.id
    })

    return res.json({profile});

})

//Fetch transaction of each user
router.get("/api/transactions", async (req,res) => {

    const user = await getAuthenticatedUser(req,res);

    try {
        
        const transactions = await Transaction.find({
            workosUserId: user.id,
        });

        // const userProfile = await UserProfile.find();

        if(transactions.length == 0){
            return res.status(200).json({message: "No Transaction for User Found"})
        }

         res.status(200).json(transactions)

    } catch (error) {
        console.log(`ERROR ${error}`)
        res.status(500).json({message:"Failed to fetch Transactions"})
    }
})

//AdD Transaction

router.post("/api/transactions", async(req,res) => {
    const user = await getAuthenticatedUser(req,res);

    try {
        const transaction = await Transaction.create({
        workosUserId: user.id,
        name: req.body.name,
        category: req.body.category,
        amount: req.body.amount,
        date: req.body.date
        
    })

        return res.status(201).json({transaction})

    } catch (error) {
        console.log(`ERROR ${error}`)
        res.status(500).json({message:"Failed to post Transactions"})
    }

})

    return router
}

