import mongoose from 'mongoose';

//This function will connect to the Mongo DB
const connectDB = async () => {
    try {
        //Attempt to connect to DB using the URI from .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);

        //If successful, log confirmation
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        //If error, log error
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;