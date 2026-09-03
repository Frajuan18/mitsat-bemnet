import mongoose from 'mongoose'

/**
 * Vercel Serverless Function — POST /api/wishes, GET /api/wishes.
 * Mirrors server/routes/wishes.js so local dev (Express) and production
 * (Vercel) behave identically. Mongoose connections are cached across
 * invocations — the recommended pattern for serverless MongoDB access.
 */

const MONGODB_URI = process.env.MONGODB_URI

const weddingWishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name must be under 100 characters'],
  },
  wish: {
    type: String,
    required: [true, 'Wish message is required'],
    trim: true,
    maxlength: [1000, 'Wish must be under 1000 characters'],
  },
  createdAt: { type: Date, default: Date.now },
})

const WeddingWish =
  mongoose.models.WeddingWish || mongoose.model('WeddingWish', weddingWishSchema)

/* Connection cache survives warm invocations */
const cached = globalThis.__weddingMongoose ?? (globalThis.__weddingMongoose = { conn: null, promise: null })

async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in environment variables.')
  }
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10_000,
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

/* Permissive CORS — the function normally serves the same origin, but this
   keeps it usable if VITE_API_URL ever points at the deployment directly. */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v)
    return res.status(204).end()
  }
  for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v)

  try {
    await connectToDatabase()
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    return res.status(503).json({
      error: 'We\u2019re getting everything ready \u2014 please try your wish again in a moment.',
    })
  }

  if (req.method === 'POST') {
    try {
      const { name, wish } = req.body ?? {}

      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required.' })
      }
      if (!wish || !wish.trim()) {
        return res.status(400).json({ error: 'Wish message is required.' })
      }

      const trimmedName = name.trim()
      const trimmedWish = wish.trim()

      if (trimmedName.length > 100) {
        return res.status(400).json({ error: 'Name must be under 100 characters.' })
      }
      if (trimmedWish.length > 1000) {
        return res.status(400).json({ error: 'Wish must be under 1000 characters.' })
      }

      const newWish = await WeddingWish.create({ name: trimmedName, wish: trimmedWish })

      return res.status(201).json({
        message: 'Your wish has been received with love.',
        wish: { name: newWish.name, createdAt: newWish.createdAt },
      })
    } catch (err) {
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message)
        return res.status(400).json({ error: messages.join(' ') })
      }
      console.error('Wish submission error:', err)
      return res.status(500).json({ error: 'Something went wrong. Please try again later.' })
    }
  }

  if (req.method === 'GET') {
    try {
      const wishes = await WeddingWish.find().sort({ createdAt: -1 })
      return res.status(200).json(wishes)
    } catch (err) {
      console.error('Fetch wishes error:', err)
      return res.status(500).json({ error: 'Failed to fetch wishes.' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' })
}