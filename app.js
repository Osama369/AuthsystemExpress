import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectdb from "./config/db.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8000;

// Connect to the database
connectdb();

// load the route
app.use("/api/user",userRoute)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
