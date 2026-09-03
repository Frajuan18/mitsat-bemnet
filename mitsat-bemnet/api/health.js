/**
 * Vercel Serverless Function — GET /api/health.
 * Lets the deployed frontend (and you) verify the API is alive.
 */
export default function handler(_req, res) {
  res.status(200).json({ status: 'ok' })
}