import mongoose from "mongoose";


export const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri)
        console.log("Connected From DB")
    } catch (error) {
        console.log("MongoDB connection failed")
        console.log("Name:", error.name)
        console.log(`ERROR connection to database ${error}`)

        if(error.cause){
            console.error("Cause:", error.cause)
        }

        process.exit(1)

    }
}



export const closeConnection = async()=> {
    await mongoose.connection.close();
    console.log(`MongoDB connection closed.`)
}