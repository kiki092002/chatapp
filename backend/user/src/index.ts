import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import { createClient } from "redis";
import userRoutes from "./routes/user.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
dotenv.config();

connectDb();
connectRabbitMQ();

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("❌ REDIS_URL is not defined in environment variables");
}

export const redisClient = createClient({ url: redisUrl });

redisClient
  .connect()
  .then(() => console.log("connect to redis"))
  .catch((error) => {
    console.error("redis connection failed!");
  });
const app = express();

app.use(express.json());
app.use("/api/v1", userRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
