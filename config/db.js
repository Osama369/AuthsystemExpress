import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
//const DATABASE_NAME = process.env.DATABASE_NAME; // Add this line to get the database name from .env
const connectdb = async () => {
  try {
    const res = await mongoose.connect(`${DATABASE_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to database: ${res.connection.host}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

export default connectdb;
