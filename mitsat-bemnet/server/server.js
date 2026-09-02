import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import wishesRouter from "./routes/wishes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true }));
app.use(express.json({ limit: "10kb" }));

const wishLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests. Please try again later." },
});

app.use("/api/wishes", wishLimiter);
app.use("/api/wishes", wishesRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables.");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.error("The server keeps running, but wish submissions are unavailable until MongoDB reconnects.");
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
