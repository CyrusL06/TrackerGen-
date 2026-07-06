import mongoose from "mongoose";


export const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri)
        console.log("Connected From DB")
    } catch (error) {
        console.error("MongoDB connection failed:", error.message || error)

        process.exit(1)

    }
}



export const closeConnection = async()=> {
    await mongoose.connection.close();
    console.log(`MongoDB connection closed.`)
}
