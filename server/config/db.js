import mongoose from "mongoose";


/** Opens the application-owned MongoDB connection using the caller-supplied URI. */
export const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri)
        console.log("Connected From DB")
    } catch (error) {
        console.error("MongoDB connection failed:", error.message || error)

        process.exit(1)

    }
}



/** Closes the process-owned MongoDB connection during controlled shutdown or tests. */
export const closeConnection = async()=> {
    await mongoose.connection.close();
    console.log(`MongoDB connection closed.`)
}
