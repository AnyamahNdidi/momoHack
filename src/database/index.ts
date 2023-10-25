import mongoose, { ConnectOptions, Mongoose } from "mongoose"
import {dbConnection} from "../config/index"


const MONGODB_URI = "mongodb://0.0.0.0:27017/momoHack";

const connectMongoose = async (): Promise<Mongoose>  => {
    try
    {
        const conn = await mongoose.connect(dbConnection.url)
        console.log(`MongoDB connnected: ${conn.connection.host}`);
        return conn
    } catch (error)
    {
        console.log(`error ${error}`)
        process.exit()
        
    }
}


export default connectMongoose;