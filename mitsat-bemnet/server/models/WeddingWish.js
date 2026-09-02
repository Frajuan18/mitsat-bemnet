import mongoose from "mongoose";

const weddingWishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [100, "Name must be under 100 characters"],
  },
  wish: {
    type: String,
    required: [true, "Wish message is required"],
    trim: true,
    maxlength: [1000, "Wish must be under 1000 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("WeddingWish", weddingWishSchema);
