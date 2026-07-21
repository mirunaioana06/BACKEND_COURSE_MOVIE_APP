import express from "express";
import { config } from "dotenv";

import movieRoutes from "./routes/movieRoutes.js";
import { connectDB } from "./config/db.js";

config();


const app = express();

await connectDB();

app.use("/movies", movieRoutes);

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});