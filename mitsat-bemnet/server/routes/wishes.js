import { Router } from "express";
import mongoose from "mongoose";
import WeddingWish from "../models/WeddingWish.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, wish } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required." });
    }
    if (!wish || !wish.trim()) {
      return res.status(400).json({ error: "Wish message is required." });
    }

    const trimmedName = name.trim();
    const trimmedWish = wish.trim();

    if (trimmedName.length > 100) {
      return res.status(400).json({ error: "Name must be under 100 characters." });
    }
    if (trimmedWish.length > 1000) {
      return res.status(400).json({ error: "Wish must be under 1000 characters." });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: "We\u2019re getting everything ready — please try your wish again in a moment.",
      });
    }

    const newWish = new WeddingWish({ name: trimmedName, wish: trimmedWish });
    await newWish.save();

    res.status(201).json({
      message: "Your wish has been received with love.",
      wish: { name: newWish.name, createdAt: newWish.createdAt },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(" ") });
    }
    console.error("Wish submission error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

router.get("/", async (_req, res) => {
  try {
    const wishes = await WeddingWish.find().sort({ createdAt: -1 });
    res.json(wishes);
  } catch (err) {
    console.error("Fetch wishes error:", err);
    res.status(500).json({ error: "Failed to fetch wishes." });
  }
});

export default router;
