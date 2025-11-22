import mongoose from "mongoose";
import 'dotenv/config'

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDb Connection successfull', conn.connection.host);
    } catch (error) {
        console.error('MongoDb Connection Failed', error.message);
        process.exit(1)
    }
}