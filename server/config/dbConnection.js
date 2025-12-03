import mongoose from "mongoose";

const MONGO_URI= process.env.MONGO_URI;

mongoose.set('strictQuery', false)

const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(`${MONGO_URI}/lms`);
        console.log(`Connected to Database ${conn.connection.host}`);
        
    } catch (error) {
        console.error("ERROR :",error);
        process.exit(1);
        
    }
}

export default connectToDB;